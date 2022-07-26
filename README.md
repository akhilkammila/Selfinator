# Smart Cam
[Video Demo](https://www.youtube.com/watch?v=-Ah46H1wutE&ab_channel=AyushGarg)

## 💡 Inspiration

The project began when I thought about the shortcomings of modern day camera apps. While most cameras have extensive post-capture image-editing options, they do not have many pre-capture features. We wondered if we could eliminate "bad photos" – where people are blinking, coughing, or talking – before they are even taken.

## 💻 What it does
Selfinator uses Artificial Intelligence to detect every face in the camera's FOV. It then determines if each face has both eyes open and has a smiling, happy expression. The camera intelligently takes photos only when every face is at their "best."

## 🔨 How we built it
We used React Native to implement the frontend of the app. Because of this, the app can be run on both iOS and Android devices. We used pre-built Machine Learning models to speed up the development process. We then isolated the left eye, right eye, and the mouth from each detected face. This allowed us to determine in real-time if everyone smiled and had their eyes open.

## 🧠 Challenges we ran into
We ran into numerous challenges throughout the app development process. One major challenge was dealing with asynchronous functions in react. The async of variables prevented our camera from taking pictures even once we detected that everyone had their "best face" on. Other issues included a failed use of GET http protocol for requests to the backend, and running SmartCam on multiple faces.

## 🏅 Accomplishments that we're proud of
We are extremely proud of implementing SmartCam with react-native, even though none of our team members had worked with mobile apps before. Our best accomplishment, however, was creating highly successful real-time face detection software.

## 📖 What we learned
We learned how to code in React Native. We learned how to use different ML models. We learned more about http protocols (GET, POST) and the limits of them.

## 🔜 What's next for Smart Cam
We plan to make Selfinator available to be used by everyone on the app store. More long term, we hope that we can license the technology to companies like Snapchat and Apple, as it could greatly enhance their camera applications.
