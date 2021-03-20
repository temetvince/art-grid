import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export interface GridSizesProps {
   gridSizes: GridSize[];
}

export interface GridSize {
   width: number;
   height: number;
   size: number;
}

export class GridSizes extends React.Component<GridSizesProps> {
   constructor(props: GridSizesProps) {
      super(props);
   }

   renderTableData(): JSX.Element[] {
      return this.props.gridSizes.map((gridSize, index) => {
         const { width, height, size } = gridSize; //destructuring
         return (
            <tr className="flex-row flex-stretch flex-justify" key={index}>
               <td>{width}</td>
               <td>{height}</td>
               <td>{size}</td>
            </tr>
         );
      });
   }

   render(): JSX.Element {
      return (
         <table id="GridSizes" className="flex-column">
            <th>Grid Sizes</th>

            <tr className="flex-row flex-stretch flex-justify">
               <td>Width</td>
               <td>Height</td>
               <td>Size</td>
            </tr>

            {this.renderTableData()}
         </table>
      );
   }
}
