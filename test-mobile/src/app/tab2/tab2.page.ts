import { Component, OnInit } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { UserPhoto, PhotoService } from "../services/photo.service";
import * as tf from "@tensorflow/tfjs";
//import * as tfnode from "@tensorflow/tfjs-node";
import convert from "tensor-as-base64";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page implements OnInit {
  model: any;
  predictions: any;
  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
    await this.loadModel();
  }

  async loadModel() {
    //load model with weights
    this.model = await tf.loadLayersModel("../../assets/test1/model.json");
    console.log("Load Model");
  }

  // Do predictions
  async predict(photo) {
    const pred = await tf.tidy(() => {
      this.photoService.loadSaved();
      console.log(photo);
      let strImage = photo.webviewPath.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );

      //const tfimage = tfnode.node.decodeImage(photo.webviewPath);
      //console.log(tfimage);
      //console.log(this.model.predict(photo));
      const tensor = convert(strImage);
      console.log("TENSOOOOOOR");

      console.log(tensor);

      // Convert the canvas pixels to

      // let img = fs.readFileSync(this.photoService.photos[0].filepath);

      // console.log(img);

      // @ts-ignore
      //img = img.reshape([1, 28, 28, 1]);
      //img = tf.cast(img, "float32");

      // Make and format the predications
      const output = this.model.predict(tensor) as any;

      console.log("BHOOOOOOOOOOOOOOOOOOO");
      console.log(output);

      // Save predictions on the component
      this.predictions = Array.from(output.dataSync());

      console.log("PREDICTIOOOOOONNNNNNN");
      console.log(this.predictions);
    });
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: "Photos",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.photoService.deletePicture(photo, position);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
