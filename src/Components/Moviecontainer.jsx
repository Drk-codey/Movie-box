import { LucideStar } from "lucide-react";
import React from "react";

const Moviecontainer = () => {
  return (
    <section>
      <div>
        <img src="" alt="" />
      </div>

      <div className="flex justify-between">
        <div className="flex">
          <p className="flex items-center gap-2">
            <span>Top Gun: Maverick</span>
            <span>•</span>
            <span>2022</span>
            <span>•</span>
            <span>PG-13</span>
            <span>•</span>
            <span>2h 11m</span>
          </p>
          <div className="flex gap-4 text-red-500">
            <button className="">Action</button>
            <button>Drama</button>
          </div>
        </div>
        <div>
          {/* <img src="" alt="" /> Replace with star Icon */}
          <LucideStar className="bg-yellow-300" />
          <p>
            <span>8.5</span>
            <span className="w-0.5 h-4"></span>
            <span>350k</span>
          </p>
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col">
          <p>
            After thirty years, Maverick is still pushing the envelope as a top
            naval aviator, but must confront ghosts of his past when he leads
            TOP GUN's elite graduates on a mission that demands the ultimate
            sacrifice from those chosen to fly it.
          </p>
          <p>
            <span>Director:</span>
            <span className="text-red-600">Joseph Kosinski</span>
          </p>
          <p>
            <span>Writers:</span>
            <span>Jim Cash, Jack Epps Jr, Peter Craig</span>
          </p>
          <p>
            <span>Stars:</span>
            <span>Tom Cruise, Jennifer Connelly, Miles Teller</span>
          </p>
          <div className="flex flex-col border rounded-3xl">
            <p className="p-5 bg-red-600 text-white rounded-3xl">
              Top rated movie #65
            </p>
            <div className="p-5">
              <label htmlFor="">Awards 9 nominations</label>
              <select name="" id=""></select>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <button>
            <img src="" alt="" />
            <p>See Showtimes</p>
          </button>
          <button>
            <img src="" alt="" />
            <p>More watch options</p>
          </button>
          <div className="relative flex gap-4 overflow-clip">
            <div className="">
              <img src="" alt="" />
            </div>
            <div>
              <img src="" alt="" />
            </div>
            <div>
              <img src="" alt="" />
            </div>
            <div className="absolute top-0 left-0 flex items-center gap-2 bg-black/50 p-2 text-white">
              <img src="" alt="" />
              <p>THe best Movies and shows in September</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Moviecontainer;
