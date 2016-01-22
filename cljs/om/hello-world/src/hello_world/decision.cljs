(ns hello-world.decision
  (:require [clojure.string :as string]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

;; (defn downvote [decision])
(defonce ENTER_KEY 13)

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

(defn downvote-disabled [decision owner]
  (<= (om/get-state owner :score) 0))

(defn upvote-disabled [decision owner]
  (>= (om/get-state owner :score) 10))

(defn stars [owner]
  (dom/span nil (string/join (take (om/get-state owner :score) (repeat "☆"))))) 

(defn is-editing [decision owner]
  (== (om/get-state owner :is-editing) 1))

(defn start-editing [event decision owner]
  (om/set-state! owner :is-editing 1))

(defn key-down [event decision owner]
  (when (== (.-which event) ENTER_KEY)
    (om/set-state! owner :is-editing 0)))

;; Component

(defn decision [decision owner]
  (reify
    om/IInitState
    (init-state [_]
      {:edit-text (:title decision)
       :score 0
       :is-editing 0})

    om/IRenderState
    (render-state [_ state]
      (dom/li #js {:className "decision"}
        (dom/div #js {:className "decision-view"}
          (if
              (is-editing decision owner)
              (dom/input #js {:className "decision-name-edit"
                              :value     (om/get-state owner :edit-text)
                              :onChange  #(change % decision owner)
                              :onKeyDown #(key-down % decision owner)})
              (dom/label #js {:onDoubleClick #(start-editing % decision owner)} (om/get-state owner :edit-text))) ;; should probably show (:title decision), but don't yet know how to update that sensibly.
          (dom/button #js {:className "decision-upvote"
                           :onClick #(upvote % decision owner)
                           :disabled (upvote-disabled decision owner)} "+")
          (dom/button #js {:className "decision-downvote"
                           :onClick #(downvote % decision owner)
                           :disabled (downvote-disabled decision owner)} "-")
          (stars owner))))
    )
  )
