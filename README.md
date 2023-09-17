## Problem

Analyzing and categorizing the **sentiment** of tweets.

**Main goal**: compare different approaches using different data sets to see which
combination succeeds in associating the right sentiment with each tweet.

**Secondary goal**: create a *firefox extension* that associate at each tweet a sentiment value converted in an emoji:

| Value | Emoji           |
|:-----:|:---------------:|
| 0     | :frowning_face: |
| 1     | :grinning:      |

[Firefox extension](./Extension/)

---

## Datasets

1. [Sentiment140 | Kaggle](https://www.kaggle.com/datasets/kazanova/sentiment140?resource=download)
   
   **[238.8MB]** ~ <u>1,600,000 tweets</u>
   
   Every tweet has been annotated (*0 = negative*, *2 = neutral*, *4 = positive*), this dataset contains 6 fields/column:
   
   * **target**: polarity of the tweet (*0 = negative, 2 = neutral, 4 = positive*)
   
   * **ID**: tweet ID
   
   * **date**: date of the tweet
   
   * **flag**: the query
   
   * **user**: the user that tweeted
   
   * **text**: the text of the tweet

---

## Methods

### Logistic regression

Allows to predict a *binary outcome* using the sigmoid function which outputs a probability between 0 (*Negative*) and 1 (*Positive*)

### Support Vector Machines

Allows to plot labelled data as points in a multi-dimensional space, there will be present a *decision boundary* that divides the data points in *Positive* and *Negative*

### Decision Tree

Use the dataset features to create *Positive* / *Negative* questions and continually split the dataset until you isolate all data points belonging to each class

### Random Forest

A meta estimator that fits a number of decision tree classifiers on various sub-samples of the dataset and uses *averaging* to improve the predictive accuracy and control over-fitting
 
---

## Evaluation framework

* **Precision**

* **Recall**

* **Accuracy**

* **F1-Score**
