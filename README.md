# SBBHack

[Link to fully functioning website!](https://SBBHack.ingleanthony.repl.co)

## Real-world-Impacts and Problems  

With this webpage, it makes it very easy for the user to input their postal code and instantly acquire the closest three lots and their current parking availability. This will help prevent people driving to parking lots that don't have anymore available parking. In turn this will save time, and money for the people who are trying to use these parking lots. Coming up with a successful way to predict data will not only impact this field, but every other field as it provides us with the ability to see a little bit into the future!

Since hardware solutions such as real-time parking sensors are expensive on a large scale, a software solution to this problem is huge advantage. With a working machine learning predicition model using tensorflow.js, we are able to predict the amount of spots open at a parking lot near a location at the current time.

## Technologies  

In our Front-end we used vanilla HTML and CSS to stylize and create the webpage with  a google maps api.
For our backend we used a JavaScript server using Node.js and express.
We used tensorflow.js to model a binomial regression with a stochastic gradient descent minimizing function that was trained over the SSB 2020 dataset.

## Usability  

We strived to keep our website user friendly by making all of the features minimalist and direct.
By adding color to the website’s different features, we made it more enjoyable and easier to use.
We also included things such as tooltips and animations to make for a better user experience.

![Screenshot](/Public/images/screenshot1.jpg)
![Screenshot](/Public/images/screenshot2.jpg)
![Mobile Screenshot](/Public/images/screenshot3.jpg)