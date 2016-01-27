(ns hello-world.utils
  (:import [goog.ui IdGenerator]))

(defn guid []
  (.getNextUniqueId (.getInstance IdGenerator)))

(defn indices [pred coll]
  (keep-indexed #(when (pred %2) %1) coll))

(defn comp-id [elem] (fn [d] (= (:id d) (:id elem))))

(defonce ENTER_KEY 13)
