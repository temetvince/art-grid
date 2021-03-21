import React from "react";

export interface GridSizeProps {
   callback: (numberOfSquares: number) => void;
}

class GridSize extends React.Component<GridSizeProps> {
   constructor(props: GridSizeProps) {
      super(props);
      this.state = {
         numberOfSquares: 1,
      };
   }

   submitted = (): void => {
      const size = Number(
         (document.getElementById("numberOfSquares") as HTMLInputElement).value
      );

      if (size < 1) {
         return;
      }

      this.props.callback(size);
   };

   render = (): JSX.Element => {
      return (
         <div className="flex-row">
            <div className="flex-stretch">
               Grid size (squares on shortest side):
            </div>

            <input
               id="numberOfSquares"
               type="number"
               defaultValue="1"
               className="input-number"
            />

            <div className="btn" onClick={this.submitted}>
               Apply
            </div>
         </div>
      );
   };
}

export default GridSize;
