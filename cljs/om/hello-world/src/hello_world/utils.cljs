(ns hello-world.utils
  (:import [goog.ui IdGenerator]))

(defn guid []
  (.getNextUniqueId (.getInstance IdGenerator)))

(defonce ENTER_KEY 13)
