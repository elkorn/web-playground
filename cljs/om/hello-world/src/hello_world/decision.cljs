(ns hello-world.decision
  (:require [cljs.core.async :refer [put!]]
            [clojure.string :as string]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [hello-world.utils :refer [ENTER_KEY]]))

(defn change [event decision owner]
  (om/set-state! owner :edit-text (-> event .-target .-value))
  )

(defn downvote [event decision] 
  (om/transact! decision :score #(if (> % 0) (- % 1) 0))
  )

(defn upvote [event decision]
  (om/transact! decision :score #(+ % 1))
  )

(defn downvote-disabled [decision]
  (<= (:score decision) 0))

(defn upvote-disabled [decision]
  (>= (:score decision) 10))

(defn stars [decision]
  (dom/span nil (string/join (take (:score decision) (repeat "☆"))))) 

(defn is-editing [decision owner]
  (== (om/get-state owner :is-editing) 1))

(defn start-editing [event decision owner]
  (om/set-state! owner :is-editing 1))

(defn key-down [event decision owner]
  (when (== (.-which event) ENTER_KEY)
    (om/set-state! owner :is-editing 0)
    (om/transact! decision :title #(om/get-state owner :edit-text))))

(defn destroy [decision comm]
  (println comm)
  (put! comm [:destroy @decision]))

;; Component

(defn decision [decision owner]
  (reify
    om/IInitState
    (init-state [_]
      {:edit-text  (:title decision)
       :score      0
       :is-editing 0})

    om/IRenderState
    (render-state [_ {:keys [comm] :as state}]
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
                           :onClick   #(upvote % decision)
                           :disabled  (upvote-disabled decision)} "+")
          (dom/button #js {:className "decision-downvote"
                           :onClick   #(downvote % decision)
                           :disabled  (downvote-disabled decision)} "-")
          (dom/button #js {:className "decision-destroy"
                           :onClick   #(destroy decision comm)
                           :disabled  (upvote-disabled decision)} "X")
          (stars decision))))
    )
  )
