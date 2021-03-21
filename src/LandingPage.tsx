import "./LandingPage.css";

import React from "react";
import { Redirect } from "react-router-dom";
/* eslint-disable @typescript-eslint/no-var-requires */
const dialog = window.require("electron").remote.dialog;
const fs = window.require("fs");

const hiddenClass = "hidden";

interface State {
   redirect: boolean;
   file: string | undefined;
}

class LandingPage extends React.Component<unknown, State> {
   constructor(props: Readonly<unknown> | unknown) {
      super(props);
      this.state = { redirect: false, file: undefined };
   }

   submitted = (): void => {
      this.setState({ redirect: true });
   };

   filePicked = (): void => {
      dialog.showOpenDialog({ properties: ["openFile"] }).then((r) => {
         const paths = r.filePaths as Array<string>;

         if (paths && paths[0]) {
            const base64 = fs.readFileSync(paths[0]).toString("base64");
            this.setState({ file: base64 });
         }
      });
   };

   show = (element: HTMLElement | null): void => {
      if (!element) return;

      if (this.isHidden(element)) {
         element.classList.remove(hiddenClass);
      }
   };

   hide = (element: HTMLElement | null): void => {
      if (!element) return;

      if (!this.isHidden(element)) {
         element.classList.add(hiddenClass);
      }
   };

   isHidden = (element: HTMLElement): boolean => {
      return element.classList.contains(hiddenClass);
   };

   render(): JSX.Element {
      if (!this.state.file) {
         this.hide(document.getElementById("Submit"));
      } else {
         this.show(document.getElementById("Submit"));
      }

      if (this.state.redirect) {
         return (
            <Redirect
               to={{
                  pathname: "/GridPage",
                  state: {
                     file: this.state.file,
                  },
               }}
            />
         );
      }

      return (
         <main>
            <div className="root flex-column flex-justify">
               <div className="container flex-column rounded">
                  <div className="content">
                     <div className="text-xl">Welcome to Art Grid</div>
                  </div>

                  <div className="content">
                     <i>
                        Art Grid is an art tool which takes an image and puts it
                        inside a grid. The grid can be turned upside down and
                        sliced up. Each grid box can be shown in random order
                        for drawing purposes.
                     </i>
                  </div>

                  <div className="btn text-md" onClick={this.filePicked}>
                     Pick an image
                  </div>

                  <div id="Submit" className="flex-column hidden">
                     <div className="btn text-md" onClick={this.submitted}>
                        Submit
                     </div>
                  </div>
               </div>
            </div>
         </main>
      );
   }
}

export default LandingPage;
