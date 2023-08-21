# Firefox extension
When scrolling on Twitter you can click **S key** and the ![analizer icon](https://github.com/RiccardoRobb/BigData_project/blob/main/Extension/analizer/icons/analizer-48.png) icon will appear in the loaded tweets.

Clicking on the icon will send the processed text to the backend and *after 10/15sec* a new icon that represents the **sentiment of the tweet** will appear.

## How to load it
* **Start the Flask backend** go to `./backend/`
  
  > `python3 main.py`


* **Load the extension file**
  [Debugging - Runtime](http://about:debugging#/runtime/this-firefox)

  * Get the **Internal UUID**
 
  * Go to `./analizer/analizer.js`
 
    > Change the `UUID_ADDON` constant with the new **Internal UUID**

  * Reload the extension
