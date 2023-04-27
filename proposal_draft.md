# Problem

Analyzing and categorizing the **sentiment** of tweets.

The scope of this project is to create a *chrome extension* that associate at each tweet a sentiment value converted in an emoji:

| Value | Emoji           |
|:-----:|:---------------:|
| 0     | :frowning_face: |
| 1     | :grinning:      |

Will be used 2 different datasets, in order to compare different approach using different dataset.

---

# Datasets

1. [Sentiment140 | Kaggle](https://www.kaggle.com/datasets/kazanova/sentiment140?resource=download)
   
   **[238.8MB]** ~ <u>1,600,000 tweets</u>
   
   Every tweet has been annotated (*0 = negative*, *2 = neutral*, *4 = positive*), this dataset contains 6 fields/column:
   
   * **target**: polarity of the tweet (*0 = negative, 2 = neutral, 4 = positive*)
   
   * **ID**: tweet ID
   
   * **date**: date of the tweet
   
   * **flag**: the query
   
   * **user**: the user that tweeted
   
   * **text**: the text of the tweet

2. [Text Emotion Recognition | Kaggle](https://www.kaggle.com/datasets/shreejitcheela/text-emotion-recognition)
   
   **[37.84MB]** ~ <u>282,782 tweets</u>
   
   Every tweet has been annotated (*0 = negative, 1 = positive*), this dataset contains 2 field/column: 
   
   * **text**: the text of the tweet
   
   * **emotion**: polarity of the tweet (*0 = negative, 1 = positive*)

---


