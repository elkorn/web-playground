(ns hello-world.new-project
  (:require [cljs.core.async :refer [put!]]
            [om.dom :as dom :include-macros true]
            [om.core :as om :include-macros true]
            [hello-world.utils :refer [ENTER_KEY]]
            [clojure.string :as string]))

(defn create [name comm]
  (put! comm [:create-project {:name name}]))

(defn enter-new-project [owner comm]
  (let [new-field      (om/get-node owner "newField")
        new-field-text (string/trim (.-value new-field))]
    (when-not (string/blank? new-field-text)
      (create new-field-text comm)
      (set! (.-value new-field) ""))))

(defn key-down [e owner comm]
  (when (== (.-which e) ENTER_KEY)
    (enter-new-project owner comm)))

;; Component

(defn new-project [_ owner]
  (reify
    om/IRenderState
    (render-state [_ {:keys [comm]}]
      (dom/p #js {:className "project-new"}
             (dom/input #js {:keyDown #(key-down % owner comm)
                             :ref "newField"
                             :placeholder "Any new projects to consider?"})
             (dom/button #js {:onClick #(enter-new-project owner comm)} "Add")
             )
      )
    )
  )
