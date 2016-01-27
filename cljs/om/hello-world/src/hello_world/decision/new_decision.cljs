(ns hello-world.decision.new-decision
  (:require [cljs.core.async :refer [put!]]
            [om.dom :as dom :include-macros true]
            [om.core :as om :include-macros true]
            [hello-world.utils :refer [ENTER_KEY]]
            [clojure.string :as string]))

(defn create [project-id title comm]
  ;; (put! comm [:create @decision])) ;; why does derefer not work here?
  (put! comm [:create-decision {:project-id project-id :title title}]))

(defn enter-new-decision [project-id owner comm]
  (let [new-field      (om/get-node owner "newField")
        new-field-text (string/trim (.-value new-field))]
    (when-not (string/blank? new-field-text)
      (create project-id new-field-text comm)
      (set! (.-value new-field) ""))))

(defn key-down [e project-id owner comm]
  (when (== (.-which e) ENTER_KEY)
    (enter-new-decision project-id owner comm)))

;; Component

(defn new-decision [_ owner]
  (reify
    om/IRenderState
    (render-state [_ {:keys [comm project-id]}]
      (dom/li #js {:className "decision-new"}
              (dom/input #js {:className   "decision-name-edit"
                              :ref         "newField"
                              :placeholder "What needs to be decided?"
                              :onKeyDown   #(key-down % project-id owner comm)
                              })
              (dom/button #js {:onClick #(enter-new-decision project-id owner comm)
                               :required true} "Add")
              ))
    ))
