import React from "react";
import Tvlogo from "../../src/assets/tv.png";
import Poster from "../../src/assets/Poster.png";
import Tomatologo from "../../src/assets/tomato-img.svg";
import ImdbLogo from "../../src/assets/imdb-img.svg";
import PlayButton from "../../src/assets/play-button.svg";

const Hero = () => {
  return (
    <div className="relative top-0 w-full max-h-[1000px] h-[600px] lg:h-[800px] text-white flex flex-col justify-center gap-6 px-6">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <img src={Poster} alt="Poster" className="size-full object-cover" />
      </div>

      <div className="max-w-7xl w-full mx-auto flex flex-col gap-8 -border">
        <div className="max-w-[404px] flex flex-col gap-3 -border">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            John Wick 3: <br />
            <span className="">Parabellum</span>
          </h1>
          <div className="flex items-center gap-8 text-xs text-white/80">
            <div className="flex items-center gap-2 text-white">
              <img src={ImdbLogo} alt="Imdb Logo" />
              <p>80.0 / 100</p>
            </div>

            <div className="flex items-center gap-2 text-white">
              <img src={Tomatologo} alt="Tomato Logo" />
              <p>97%</p>
            </div>
          </div>

          <p className="max-w-2xl font-bold text-white">
            John Wick is on the run after killing a member of the international
            assassins guild, and with a $14 million price tag on his head, he is
            the target of hit men and women everywhere.
          </p>
          <button className="flex items-center gap-2 bg-red-500 text-black w-fit px-4 py-2 rounded-md cursor-pointer">
            <img src={PlayButton} alt="" />
            <p className=" text-white font-bold">Watch Trailer</p>
          </button>
        </div>
      </div>

      <div className="absolute max-sm:bottom-2 max-sm:left-1/2 sm:right-10 sm:bottom-  flex sm:flex-col max-sm:gap-1.5 ">
        {[1, 2, 3, 4, 5].map((no, key) => {
          return (
            <div
              key={key}
              className="flex items-center max-sm:flex-col max-sm:gap-3 gap-2 text-white"
            >
              <span className="w-4 h-0.5 bg-white max-sm:rotate-90"></span>
              <p key={key} className="">
                {no}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
