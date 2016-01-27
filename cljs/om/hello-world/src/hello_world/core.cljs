(ns hello-world.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [put! <! chan]]
            [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [hello-world.app-state :as app-state]
            [hello-world.utils :refer [guid indices comp-id]]
            [hello-world.project.new-project :as new-project]
            [hello-world.project :as project]))

(enable-console-print!)

(defn header []
  (dom/header #js {:id "header"}
              (dom/h1 nil "Big decisions")))

(defn handle-event [type state val]
  (case type
    :destroy-decision (app-state/destroy-decision state val)
    :create-decision (app-state/create-decision state val)
    :destroy-project (app-state/destroy-project state val)
    :create-project (app-state/create-project state val)
    nil))

(defn big-decision-app [{:keys [projects] :as state} owner]
  (reify
    om/IWillMount
    (will-mount [_]
      (let [comm (chan)]
        (om/set-state! owner :comm comm)
        (go (while true
              (let [[type value] (<! comm)]
                (handle-event type state value))))))
    om/IRenderState
    (render-state [_ {:keys [comm]}]
      (dom/div nil
               (header)
               (om/build new-project/new-project nil {:init-state {:comm comm}})
               (map #(project/project % comm) projects)))))

(om/root
  big-decision-app
  app-state/app-state
  {:target (. js/document (getElementById "app"))})

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
  )

;; *#1 List your features:* We wrote down everything that we thought we would like as a feature in a house and property. We’d both lived in at least 5 places by now, and inspected scores more, so it was a pretty long list. We also wrote down things that we definitely didn’t want, but we wrote these as positive items — things we wanted — e.g. “Not next to a power substation.”

;; *#2 Sort your features:* We sorted the list of features, so that we had a list of most important features to least important. I actually wrote a small computer program that helped us do this by presenting features two at a time and making us choose which was more important. We asked ourselves: “If there were two identical houses except that one had this feature and the other house had the other feature, which would we choose?” We entered this into the program, and it sorted the list based on our answers.

;; *#3 Score your options:* For every house we visited, we scored the property for each feature out of 5 stars (no half stars allowed!). We kept the whole thing together in one spreadsheet. This gave us a commanding overview of the decision we were making.
