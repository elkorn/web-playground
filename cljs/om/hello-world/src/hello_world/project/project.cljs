(ns hello-world.project
  (:require 
   [cljs.core.async :refer [put!]]
   [om.core :as om :include-macros true]
   [om.dom :as dom :include-macros true]
   [hello-world.decision :as decision]
   [hello-world.decision.new-decision :as new-decision]))

(defn destroy [e project-id comm]
  (put! comm [:destroy-project {:project-id project-id}])
  )

(defn project [{:keys [id name decisions] :as state} comm]
  (dom/div nil
           (dom/ul #js {:className "project" }
                   (dom/header nil 
                               (dom/h2 #js {:className "project-name"}
                                       (dom/span nil name)
                                       (dom/button #js {:onClick #(destroy % id comm)} "X"))
                                    )
                   (om/build new-decision/new-decision nil {:init-state {:comm comm :project-id id}})
                   (om/build-all decision/decision (sort-by :score #(> % %2) decisions) {:init-state {:comm comm :project-id id} :key :id})))
  )
