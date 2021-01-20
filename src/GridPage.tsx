import "./LandingPage.css";

import React from "react";
import { Redirect } from "react-router-dom";

export interface GridPageProps {
   width: number;
   height: number;
   file: string;
}

interface State {
   redirect: boolean,
   grid: HTMLCanvasElement[],
}

class GridPage extends React.Component<GridPageProps, State> {
   constructor(props: GridPageProps) {
      super(props);
      console.log(props);
      this.state = { redirect: false, grid: [] };
      const image = new Image();
      image.src = "data:image/jpg;base64," + this.props.file;
      console.log("here");
      image.onload = () => {
         console.log("here2");
         // create a canvas
         const canvas = document.createElement("canvas");
         //set its size to match the image
         canvas.width = image.width;
         canvas.height = image.height;
         console.log(image.width);
         console.log(image.height);

         const ctx = canvas.getContext("2d"); // get the 2d interface
         // draw the image on the canvas
         ctx?.drawImage(image, 0, 0);
         // get the tile size
         const gcd2 = gcd(canvas.width, canvas.height);
         console.log("GCD: " + gcd2);
         console.log("X: " + canvas.width / gcd2);
         console.log("Y: " + canvas.height / gcd2);

         let x, y;

         const grid2 = [];
         // for each tile
         for (y = 0; y < canvas.height; y += gcd2) {
            const grid: HTMLCanvasElement[] = [];
            for (x = 0; x < canvas.width; x += gcd2) {
               // get the pixel data
               const imgData = ctx?.getImageData(x, y, gcd2, gcd2);
               const canvas2 = document.createElement("canvas");
               canvas2.width = gcd2;
               canvas2.height = gcd2;
               const ctx2 = canvas2.getContext("2d");
               if (imgData) {
                  ctx2?.putImageData(imgData, 0, 0);
                  grid.push(canvas2);
               }
            }
            grid2.push(grid);
         }
         // all done now fetch the images for the found tiles.
         document.body.appendChild(grid2[2][0]);
      };
   }

   buttonClicked = (): void => {
      this.setState({ redirect: true });
   };

   render(): JSX.Element {
      if (this.state.redirect) {
         return <Redirect to={{ pathname: "/" }} />;
      }

      return (
         <main>
            <div className="btn text-md" onClick={this.buttonClicked}>
               Start Over
            </div>
         </main>
      );
   }
}

function gcd(x: number, y: number): number {
   x = Math.abs(x);
   y = Math.abs(y);
   while (y) {
      const t = y;
      y = x % y;
      x = t;
   }
   return x;
}

export default GridPage;
