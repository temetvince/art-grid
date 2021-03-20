import "./LandingPage.css";

import React from "react";
import { Redirect } from "react-router-dom";
/* eslint-disable @typescript-eslint/no-var-requires */
const dialog = window.require("electron").remote.dialog;
const fs = window.require("fs");

interface State {
   redirect: boolean;
   file: string;
}

class LandingPage extends React.Component<unknown, State> {
   constructor(props: Readonly<unknown> | unknown) {
      super(props);
      this.state = { redirect: false, file: "" };
   }

   submitted = (): void => {
      this.setState({ redirect: true });
   };

   filePicked = (): void => {
      dialog.showOpenDialog({ properties: ["openFile"] }).then((r) => {
         const paths = r.filePaths as Array<string>;
         const base64 = fs.readFileSync(paths[0]).toString("base64");
         this.setState({ file: base64 });
      });
   };

   render(): JSX.Element {
      if (this.state.redirect) {
         const width = (document.getElementById("width") as HTMLInputElement)
            .value;
         const height = (document.getElementById("height") as HTMLInputElement)
            .value;

         return (
            <Redirect
               to={{
                  pathname: "/GridPage",
                  state: {
                     width: width,
                     height: height,
                     file: this.state.file,
                  },
               }}
            />
         );
      }

      return (
         <main>
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
                           Art Grid is an art tool which takes an image and puts
                           it inside a grid. The grid can be turned upside down
                           and sliced up. Each grid box can be shown in random
                           order for drawing purposes.
                        </i>
                     </div>

                     <div className="grow-one-column flex-column content">
                        <div className="grow-one-column">
                           <div className="flex-column flex-stretch">
                              <div className="grow-one-column">
                                 Grid size (width):
                              </div>
                              <div className="grow-one-column">
                                 Grid size (height):
                              </div>
                           </div>

                           <div className="flex-column">
                              <input
                                 id="width"
                                 type="number"
                                 defaultValue="10"
                                 className="inputNumber"
                              />
                              <input
                                 id="height"
                                 type="number"
                                 defaultValue="10"
                                 className="inputNumber"
                              />
                           </div>
                        </div>
                     </div>

                     <div className="btn text-md" onClick={this.filePicked}>
                        Pick an image
                     </div>

                     <div className="grow-one-column flex-column content">
                        <div className="btn text-md" onClick={this.submitted}>
                           Submit
                        </div>
                     </div>
                  </div>
                  <div className="grow-one-column" />
               </div>

               <div className="grow-one-row flex-stretch" />
            </div>
         </main>
      );
   }
}

export default LandingPage;
