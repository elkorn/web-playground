(ns hello-world.project
  (:require 
   [om.core :as om :include-macros true]
   [om.dom :as dom :include-macros true]
   [hello-world.decision :as decision]
   [hello-world.new-decision :as new-decision]))

(defn project [{:keys [id name decisions] :as state} comm]
  (dom/div nil
           (dom/ul #js {:className "project" }
                   (dom/h2 #js {:className "project-name"} name)
                   (om/build new-decision/new-decision nil {:init-state {:comm comm}})
                   (om/build-all decision/decision (sort-by :score #(> % %2) decisions) {:init-state {:comm comm :project-id id} :key :id})))
  )
