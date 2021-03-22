# SBBHack

[Link to fully functioning website!](https://SBBHack.ingleanthony.repl.co)
(If you aren't sure what postal code to try, try 3400)

## Real-world-Impacts and Problems  

  With this webpage, it makes it very easy for the user to input their postal code and instantly acquire the closest three lots and their current parking availability. This will help prevent people driving to parking lots that don't have anymore available parking. In turn this will save time, and money for the people who are trying to use these parking lots. Coming up with a successful way to predict data will not only impact this field, but every other field as it provides us with the ability to see a little bit into the future!

  Since hardware solutions such as real-time parking sensors are expensive on a large scale, a software solution to this problem is huge advantage. With a working machine learning predicition model using tensorflow.js, we are able to predict the amount of spots open at a parking lot near a location at the current time.

## Technologies  

- In our front-end we used basic HTML and CSS to create a modern and simplistic design.
- We also used vanilla Javascript in the front-end to work with the Google Maps API and create a great user experience.
- For our back-end we created a JavaScript server using Node.js and Express.
- We used tensorflow.js to model a binomial regression with a stochastic gradient descent minimizing function that was trained over the SBB 2020 dataset.

## Usability  

  We strived to keep our website user friendly by making all of the features minimalist and direct.
By adding color to the website’s different features, we made it more enjoyable and easier to use.
We also included things such as tooltips and animations to make for a better user experience.

## Challenges

  Taking on a project like this in under 36 hours was one of our biggest challenges, but pulling it off was one of our biggest successes. Each of us worked on a specialized aspect of the website and 2 hours before the deadline, we got our machine model to work and we were beyond excited. Writing and training a working machine learning model in such a short amount of time was a big obstacle for us. Working with apis that we had never worked with was another big challenge. Being pretty inexperienced in the aspect of full-stack development, we were so proud to deliver a fully functional product in under 36 hours. As a team, we cooperated well, learned and grew so much in such a short amount of time.

![demo image](/Public/images/demo.jpg)
