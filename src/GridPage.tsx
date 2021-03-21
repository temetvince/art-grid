import "./GridPage.css";

import React from "react";
import { Redirect } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PNG, resize } from "resize-image";

const Y = 0;
const X = 0;
const PRINT_SIZE = 500;

export interface GridPageProps {
   file: string;
}

interface State {
   redirect: boolean;
   grid: HTMLCanvasElement[];
   squareSize: number;
   image: HTMLImageElement;
}

class GridPage extends React.Component<GridPageProps, State> {
   constructor(props: GridPageProps) {
      super(props);
      this.state = {
         redirect: false,
         grid: [],
         squareSize: 1,
         image: new Image(),
      };
      this.setupImage(this.state.image);
   }

   buttonClicked = (): void => {
      this.setState({ redirect: true });
   };

   submitted = (): void => {
      const size = Number(
         (document.getElementById("numberOfSquares") as HTMLInputElement).value
      );

      if (size < 1) {
         return;
      }

      this.setState({ squareSize: size }, () => {
         this.run(this.state.image);
      });
   };

   setupImage = (image: HTMLImageElement): HTMLImageElement => {
      image.src = "data:image/jpg;base64," + this.props.file;
      image.onload = () => {
         this.run(image);
      };

      return image;
   };

   run = (
      image:
         | HTMLCanvasElement
         | HTMLImageElement
         | SVGImageElement
         | HTMLVideoElement
         | ImageBitmap
         | OffscreenCanvas
   ): void => {
      const boxWidthInPX = Math.floor(
         (image.width as number) / this.state.squareSize
      );
      const boxHeightInPx = Math.floor(
         (image.height as number) / this.state.squareSize
      );
      const lowest = Math.min(boxHeightInPx, boxWidthInPX);

      // create a canvas
      const canvas = document.createElement("canvas");

      //set its size to match the grid
      canvas.width = boxWidthInPX * this.state.squareSize;
      canvas.height = boxHeightInPx * this.state.squareSize;

      // get the 2d interface
      const ctx = canvas.getContext("2d");

      // draw the image on the canvas
      ctx?.drawImage(image, 0, 0);

      this.gridify(canvas, ctx, lowest);
   };

   gridify = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D | null,
      squareSize: number
   ): void => {
      let x, y;

      const grid2: HTMLCanvasElement[][] = [];
      // for each tile
      for (y = 0; y < canvas.height; y += squareSize) {
         const grid: HTMLCanvasElement[] = [];
         for (x = 0; x < canvas.width; x += squareSize) {
            // get the pixel data
            const imgData = ctx?.getImageData(x, y, squareSize, squareSize);
            const canvas2 = document.createElement("canvas");
            canvas2.width = squareSize;
            canvas2.height = squareSize;
            const ctx2 = canvas2.getContext("2d");
            if (imgData) {
               ctx2?.putImageData(imgData, 0, 0);
               grid.push(canvas2);
            }
         }
         grid2.push(grid);
      }
      // all done now fetch the images for the found tiles.
      (async () => {
         const image = await resize(grid2[Y][X], PRINT_SIZE, PRINT_SIZE, PNG);

         const resized = document.getElementById("resized") as HTMLImageElement;
         if (resized) resized.src = image;
      })();
   };

   render(): JSX.Element {
      if (this.state.redirect) {
         return <Redirect to={{ pathname: "/Landing" }} />;
      }

      return (
         <main>
            <div className="root flex-column flex-justify">
               <div className="container flex-column rounded">
                  <img id="resized" alt="" />

                  <div className="content">
                     <div className="flex-row flex-stretch">
                        <div className="flex-stretch">
                           Grid size (squares on shortest side):
                        </div>

                        <input
                           id="numberOfSquares"
                           type="number"
                           defaultValue="1"
                           className="inputNumber"
                        />

                        <div className="btn" onClick={this.submitted}>
                           Apply
                        </div>
                     </div>
                  </div>

                  <div className="flex-row flex-stretch flex-justify">
                     <div className="btn text-md" onClick={this.buttonClicked}>
                        Start Over
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}

export default GridPage;
