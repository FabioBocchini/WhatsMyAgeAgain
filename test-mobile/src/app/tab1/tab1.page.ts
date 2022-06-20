import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  // initialize key objects
  model: any;
  char2idx: object;
  idx2char: string[];
  text: string = 'Hey Marco ';
  inputTensor: tf.Tensor;

  async ngOnInit() {
    this.model = await tf.loadLayersModel(
      '../../assets/LSTM_e256_sl100_0414/model_js/model.json'
    ); // load model
    // also load the character to index mappings
    this.char2idx = await $.getJSON(
      '../../assets/LSTM_e256_sl100_0414/char2idx.json',
      function (json) {
        return json.responseJSON;
      }
    );
    // execute function to get idx2char array
    this.idx2char = await convertIdx(this.char2idx);
  }

  generate(text) {
    // check if the user has changed the text and if so reset model state
    if (this.text != text) this.model.resetStates();
    this.text = text; // update class text
    text =
      text.length > 100 ? text.slice(text.length - 100, text.length) : text; // slice long text

    let y_hat: tf.Tensor; // initialize variables we will be using
    let yTypeArray: Iterable<unknown>;
    let yArray: object;
    let yIdx: number;

    // converting start string to numbers (vectorisation/embedding)
    const idxArray = getNum(this.char2idx, text);

    // iterate through producing 100 predictions (characters)
    for (let i = 0; i < text.length + 100; i++) {
      if (i < text.length) {
        // for the length of the text, we are just passing the user input
        this.inputTensor = tf.expandDims([idxArray[i]], 0); // convert array to compatible tensor
      }

      y_hat = this.model.predict(this.inputTensor); // make model prediction

      y_hat = tf.squeeze(y_hat, [0]); // reformat tensor dimensions
      yTypeArray = y_hat.dataSync(); // convert tensor to JS TypeArray
      yArray = Array.from(yTypeArray); // convert TypeArray to normal Array
      // take index of max value in array (character index with highest probability)
      yIdx = indexOfMax(yArray);
      // prepare prediction as input to next iteration
      this.inputTensor = tf.expandDims([yIdx], 0);

      if (i >= text.length - 1) {
        // append prediction as input to next iteration
        this.text = this.text.concat(this.idx2char[yIdx]);
      }
    }
  }
}

// build a idx2char mapping array too, first create function
async function convertIdx(c2i) {
  let idx2char: string[];
  idx2char = Object.keys(c2i);
  return idx2char;
}

// function to get the index number for each character in input string
function getNum(c2i, text: string) {
  let idxArray: number[] = [];
  for (let i = 0; i < text.length - 1; i++) {
    idxArray.push(c2i[text.slice(i, i + 1)]);
  }
  return idxArray;
}

// define function for retrieving index of maximum value
function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }
  return maxIndex;
}
