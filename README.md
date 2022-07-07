# What's My Age Again

A mobile app that recognizes your Gender, Age and Ethnicity made with:

- Model Training:
  - [Keras](https://keras.io/)
  - [Kggle](https://www.kaggle.com/)
  - [Google Colab](https://colab.research.google.com/?utm_source=scs-index)
  - [UTK-Face Dataset](https://susanqq.github.io/UTKFace/)  

- Mobile App:
  - [React Native](https://reactnative.dev/)
  - [Expo](https://docs.expo.dev/)
  - [TensorflowJS](https://www.tensorflow.org/js)

## Running

### Build the model

No dependency is required

- Open the notebook on Colab
- Copy the dataset to your Google Drive account
- Run everything (if you want to use the GPU for the training you'll need Colab pro )
- The model will be saved in the Colab file system as `YYYYMMDDHHMMSS.hs`, you can download it from here

### Build the app

For this part you'll need to have installed **React Native**, **Expo** and **Tensorflow**

Transform the `.h5` model to be used with tensorflow
```bash
$ tensorflowjs_converter --input_format=keras --weight_shard_size_bytes 60000000 saved_model.h5 /path_to_model_direcotry
```

Take the `.json` and `.bin` file generated and move it to `mobile-app/assets/model/`

Move into app directory and install dependencies
```bash
cd mobile-app
npm i  # or yarn
```

Start expo-launcher
```bash
expo start
```

Now you can use your mobile expo client to use the app or expo-cli to deploy the app

## Authors

[Fabio Bocchini](https://github.com/FabioBocchini)

[Fabrizio Fagiolo](https://github.com/F-a-b-r-i-z-i-o)

## Disclaimer

Made for **Machine Learning** Exam

We do not intend to offend anyone
