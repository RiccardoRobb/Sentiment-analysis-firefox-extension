from flask import Flask, jsonify, request

import pyspark
from pyspark import SparkConf

from pyspark.sql import *
from pyspark.sql.types import *
from pyspark.sql.functions import *

from pyspark.ml.linalg import Vectors, VectorUDT
from pyspark.ml.feature import VectorAssembler, Tokenizer, StopWordsRemover

from pyspark.ml.classification import LogisticRegressionModel

from nltk.stem.snowball import SnowballStemmer

import gensim.downloader as api

conf = SparkConf().\
                set('spark.ui.port', "8001").\
                set('spark.executor.memory', '4G').\
                set('spark.driver.memory', '45G').\
                set('spark.driver.maxResultSize', '10G').\
                setAppName("Twitter sentiment analysis").\
                setMaster("local[*]")

sc = pyspark.SparkContext(conf=conf)
spark = SparkSession.builder.getOrCreate()

embeddings = 100
word2vector = None

if word2vector == None:
  word2vector = api.load("glove-twitter-" + str(embeddings))

lr_model = LogisticRegressionModel.load("LogisticRegressionModel")

app = Flask("tweet sentiment analizer")

##################
tokenizer = Tokenizer(inputCol = "text", outputCol = "tokens")

stopwords_remover = StopWordsRemover(inputCol = "tokens", outputCol = "terms")

stemmer = SnowballStemmer(language = "english")
stemmer_udf = udf(lambda tokens: [stemmer.stem(token) for token in tokens], ArrayType(StringType()))

extractor_udf = udf(lambda tokens: [[float(x) for x in word2vector[token]] if token in word2vector else [float(0.0)]*word2vector["tweet"].shape[0] for token in tokens], ArrayType((ArrayType(FloatType()))))
avg_embedding_udf = udf(lambda x :[float(y) for y in np.mean(x, axis = 0)])

to_vector_udf = udf(lambda embedded: Vectors.dense(embedded), VectorUDT())

assembler = VectorAssembler(inputCols = ["hour", "day_name", "tweet_embeddings"], outputCol = "features")
##################

@app.route("/api", methods=["POST"])
def analize():
	print(request.json)

	dept = [(request.json["content"], request.json["hour"], request.json["day"])]
	dept_cols = ["text", "hour", "day_name"]

	df = spark.createDataFrame(data=dept, schema = dept_cols)

	# Tokenization
	tokens_df = tokenizer.transform(df)

	# Stopword removal
	terms_df = stopwords_remover.transform(tokens_df)

	# Stemming
	tweets_df = terms_df.withColumn("terms_stemmed", stemmer_udf("terms"))

	# Unnecessary columns removal
	tweets_df = tweets_df.drop("text", "tokens", "terms")

	# Word2Vect
	tweets_embedded = tweets_df.withColumn("tweet_embeddings", extractor_udf("terms_stemmed"))
	tweets_embedded = tweets_embedded.withColumn("tweet_embeddings", avg_embedding_udf("tweet_embeddings"))

	#
	tweets_embedded = tweets_embedded.withColumn("tweet_embeddings", to_vector_udf(tweets_embedded.tweet_embeddings))

	#
	df = assembler.transform(tweets_embedded).select("features")

	##
	prediction = lr_model.transform(df).head().prediction
	print(prediction)

	return jsonify({"result": prediction, "id": request.json["id"], "content": {"text": request.json["content"], "hour": request.json["hour"], "day": request.json["day"]}}), 201

@app.route("/api/update", methods=["POST"])
def feedback():
	print(request.json)

	# FINE-TUNING  ->  add loading/wait in JS

	return jsonify({"result": "done"}), 201

if __name__ == "__main__":
	app.run(debug = True)

