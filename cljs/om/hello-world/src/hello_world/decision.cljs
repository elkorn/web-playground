(ns hello-world.decision
  (:require [clojure.string :as string]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

;; (defn downvote [decision])

;; Component

(defn change [event decision owner]
  (om/set-state! owner :edit-text (-> event .-target .-value))
  (.log js/console (om/get-state owner :edit-text)))

(defn downvote [event decision owner]
  (let [state (om/get-state owner :score)]
    (om/set-state! owner :score (if (> state 0) (- state 1) 0)))
  )

(defn upvote [event decision owner]
  (om/set-state! owner :score (+ 1 (om/get-state owner :score)))
  )

(defn stars [owner]
  (dom/span nil (string/join (take (om/get-state owner :score) (repeat "☆"))))) 


(defn decision [decision owner]
  (reify
    om/IInitState
    (init-state [_]
      {:edit-text (:title decision)
       :score 0})

    om/IRenderState
    (render-state [_ state]
      (dom/li #js {:className "decision"}
        (dom/div #js {:className "decision-view"}
          (dom/input #js {:className "decision-name-edit"
                          :value     (om/get-state owner :edit-text)
                          :onChange  #(change % decision owner)})
          (dom/button #js {:className "decision-upvote"
                           :onClick #(upvote % decision owner)} "+")
          (dom/button #js {:className "decision-downvote"
                           :onClick #(downvote % decision owner)} "-")
          (stars owner))))

    )

  )
