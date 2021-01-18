import React from "react";
import "./LandingPage.css";

const LandingPage = (): React.ReactElement => {
   return (
      <div className="root flex-row">
         <div className="grow-one-row flex-stretch" />

         <div className="grow-three-column flex-stretch flex-column">
            <div className="grow-one-column" />

            <div className="grow-two-column flex-column container rounded">
               <div className="grow-one-column content">
                  <div className="text-xl">Welcome to Art Grid</div>
               </div>

               <div className="grow-three-column content">
                  <i>
                     Art Grid is an art tool which takes an image and puts it
                     inside a grid. The grid can be turned upside down and
                     sliced up. Each grid box can be shown in random order for
                     drawing purposes.
                  </i>
               </div>

               <div className="grow-one-column">
                  <div className="btn text-md">Pick an image</div>
               </div>
            </div>
            <div className="grow-one-column" />
         </div>

         <div className="grow-one-row flex-stretch" />
      </div>
   );
};

export default LandingPage;
