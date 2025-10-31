class MockAuthBackend {
  constructor() {
    // Simulated database (in browser memory)
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    this.sessions = JSON.parse(sessionStorage.getItem('mockSessions') || '[]');
    
    // Add a demo user if none exists
    if (this.users.length === 0) {
      this.users.push({
        id: 1,
        name: 'Demo User',
        email: 'demo@moviebox.com',
        password: 'demo123', // In real app, this would be hashed!
        createdAt: new Date().toISOString(),
      });
      this.saveUsers();
    }
  }

  // Helper to save users to localStorage
  saveUsers() {
    localStorage.setItem('mockUsers', JSON.stringify(this.users));
  }

  // Helper to save sessions
  saveSessions() {
    sessionStorage.setItem('mockSessions', JSON.stringify(this.sessions));
  }

  // Generate a fake JWT token
  generateToken(userId) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId, 
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    const signature = btoa(`mock_signature_${userId}_${Date.now()}`);
    return `${header}.${payload}.${signature}`;
    console.log('Token generated:', `${header}.${payload}.${signature}`);
    console.log('Token generated:', token);
  }

   // Decode token to get userId
  decodeToken(token) {
    try {
      const [, payload] = token.split('.');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

    // Simulate network delay
  async simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

   // REGISTER USER
  async register({ name, email, password }) {
    await this.simulateDelay();

    // Validation
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if email already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser = {
      id: this.users.length + 1,
      name,
      email,
      password, // In real app: hash with bcrypt!
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.saveUsers();

    // Generate token
    const token = this.generateToken(newUser.id);

    // Save session
    this.sessions.push({ userId: newUser.id, token, createdAt: Date.now() });
    this.saveSessions();

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  // LOGIN USER
  async login({ email, password }) {
    await this.simulateDelay();

    // Validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Save session
    this.sessions.push({ userId: user.id, token, createdAt: Date.now() });
    this.saveSessions();

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  // LOGOUT USER
  async logout(token) {
    await this.simulateDelay(200);

    // Remove session
    this.sessions = this.sessions.filter(s => s.token !== token);
    this.saveSessions();

    return { message: 'Logged out successfully' };
  }

  // VERIFY TOKEN (for auto-login on page refresh)
  async verifyToken(token) {
    await this.simulateDelay(300);

    if (!token) {
      throw new Error('No token provided');
    }

    // Decode token
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token');
    }

    // Check if token expired
    if (decoded.exp < Date.now()) {
      throw new Error('Token expired');
    }

    // Find user
    const user = this.users.find(u => u.id === decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if session exists
    const session = this.sessions.find(s => s.token === token);
    if (!session) {
      throw new Error('Session not found');
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  // GET CURRENT USER
  async getCurrentUser(token) {
    return this.verifyToken(token);
  }

  // UPDATE USER PROFILE
  async updateProfile(token, updates) {
    await this.simulateDelay();

    const decoded = this.decodeToken(token);
    if (!decoded) throw new Error('Invalid token');

    const user = this.users.find(u => u.id === decoded.userId);
    if (!user) throw new Error('User not found');

    // Update user
    Object.assign(user, {
      ...updates,
      id: user.id, // Don't allow ID change
      email: user.email, // Don't allow email change (in this mock)
      password: user.password, // Don't change password here
    });

    this.saveUsers();

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  // CHANGE PASSWORD
  async changePassword(token, { currentPassword, newPassword }) {
    await this.simulateDelay();

    const decoded = this.decodeToken(token);
    if (!decoded) throw new Error('Invalid token');

    const user = this.users.find(u => u.id === decoded.userId);
    if (!user) throw new Error('User not found');

    // Verify current password
    if (user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    // Update password
    user.password = newPassword;
    this.saveUsers();

    return { message: 'Password changed successfully' };
  }

}

export const mockAuthBackend = new MockAuthBackend();

// Export mock API that mimics fetch responses
export const mockAuthAPI = {
  async register(data) {
    try {
      const result = await mockAuthBackend.register(data);
      return {
        ok: true,
        json: async () => result,
      };
    } catch (error) {
      return {
        ok: false,
        json: async () => ({ message: error.message }),
      };
    }
  },

  async login(data) {
    try {
      const result = await mockAuthBackend.login(data);
      return {
        ok: true,
        json: async () => result,
      };
    } catch (error) {
      return {
        ok: false,
        json: async () => ({ message: error.message }),
      };
    }
  },

  async logout(token) {
    try {
      const result = await mockAuthBackend.logout(token);
      return {
        ok: true,
        json: async () => result,
      };
    } catch (error) {
      return {
        ok: false,
        json: async () => ({ message: error.message }),
      };
    }
  },

  async verifyToken(token) {
    try {
      const result = await mockAuthBackend.verifyToken(token);
      return {
        ok: true,
        json: async () => result,
      };
    } catch (error) {
      return {
        ok: false,
        json: async () => ({ message: error.message }),
      };
    }
  },

  async updateProfile(token, updates) {
    try {
      const result = await mockAuthBackend.updateProfile(token, updates);
      return {
        ok: true,
        json: async () => result,
      };
    } catch (error) {
      return {
        ok: false,
        json: async () => ({ message: error.message }),
      };
    }
  },

  async changePassword(token, data) {
    try {
      const result = await mockAuthBackend.changePassword(token, data);
      return {
        ok: true,
        json: async () => result,
      };
    } catch (error) {
      return {
        ok: false,
        json: async () => ({ message: error.message }),
      };
    }
  },
}

export default mockAuthAPI;