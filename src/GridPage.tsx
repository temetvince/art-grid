import React from "react";
import { Redirect } from "react-router-dom";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { PNG, resize } from "resize-image";
import { GridSizes, GridSize } from "./GridSizes";

const Y = 0;
const X = 0;
const PRINT_SIZE = 500;
const SQUARE_SIZE = 30;

export interface GridPageProps {
   width: number;
   height: number;
   file: string;
}

interface State {
   redirect: boolean;
   grid: HTMLCanvasElement[];
   sizes: GridSize[];
}

class GridPage extends React.Component<GridPageProps, State> {
   constructor(props: GridPageProps) {
      super(props);
      this.state = { redirect: false, grid: [], sizes: [] };
      this.setupImage(new Image());
   }

   buttonClicked = (): void => {
      this.setState({ redirect: true });
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
      // create a canvas
      const canvas = document.createElement("canvas");

      //set its size to match the image
      canvas.width = image.width as number;
      canvas.height = image.height as number;

      // get the 2d interface
      const ctx = canvas.getContext("2d");

      // draw the image on the canvas
      ctx?.drawImage(image, 0, 0);

      // get the tile size
      const gcdenom = this.findGDC(canvas.width, canvas.height);
      const factors = this.factorize(gcdenom).reverse();
      const widthSizes = this.divideArray(factors, canvas.width);
      const heightSizes = this.divideArray(factors, canvas.height);

      //print sizes to console
      const newSizes: GridSize[] = [];
      for (let i = 0; i < widthSizes.length; i++) {
         const gridSize = {
            width: widthSizes[i],
            height: heightSizes[i],
            size: factors[i],
         };

         if (!newSizes.includes(gridSize)) {
            newSizes.push(gridSize);
         }

         const display =
            "Grid: " +
            widthSizes[i] +
            " x " +
            heightSizes[i] +
            " => " +
            factors[i] +
            "px";
         console.log(display);
      }

      this.setState({ sizes: newSizes });

      this.gridify(canvas, ctx);
   };

   findGDC = (n1: number, n2: number): number => {
      let x = Math.abs(n1);
      let y = Math.abs(n2);

      while (y) {
         const t = y;
         y = x % y;
         x = t;
      }

      return x;
   };

   factorize = (number: number): Array<number> => {
      const result = [];

      for (let i = 1; i <= number; i++) {
         if (number % i) continue;
         result.push(i);
      }

      return result;
   };

   divideArray = (factors: Array<number>, number: number): Array<number> => {
      const result: number[] = [];

      factors.forEach((factor) => {
         result.push(this.divide(factor, number));
      });

      return result;
   };

   divide = (n1: number, n2: number): number => {
      return n2 > n1 ? n2 / n1 : n1 / n2;
   };

   gridify = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D | null
   ): void => {
      let x, y;

      const grid2: HTMLCanvasElement[][] = [];
      // for each tile
      for (y = 0; y < canvas.height; y += SQUARE_SIZE) {
         const grid: HTMLCanvasElement[] = [];
         for (x = 0; x < canvas.width; x += SQUARE_SIZE) {
            // get the pixel data
            const imgData = ctx?.getImageData(x, y, SQUARE_SIZE, SQUARE_SIZE);
            const canvas2 = document.createElement("canvas");
            canvas2.width = SQUARE_SIZE;
            canvas2.height = SQUARE_SIZE;
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
            <div className="root flex-column">
               <div className="flex-row">
                  <div className="btn text-md" onClick={this.buttonClicked}>
                     Start Over
                  </div>
                  <GridSizes gridSizes={this.state.sizes} />
               </div>
               <img id="resized" alt="" />
            </div>
         </main>
      );
   }
}

export default GridPage;
