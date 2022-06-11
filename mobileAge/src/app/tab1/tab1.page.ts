import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  constructor() {}

  async loadModel() {
    const model = await tf.loadLayersModel('file://src/assets/reset50.json');
  }

  ngOnInit() {
    this.loadModel();
    console.log('Load Model');
  }
}
