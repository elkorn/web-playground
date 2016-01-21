(ns hello-world.core
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [hello-world.decision :as decision]))


(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(def app-state (atom {:text "Hello world!" :subtext "huppa-duppa" :decisions [{:title "First decision"}]}))

(defn decision-list [decisions new-decision owner]
  (dom/div nil
    (om/build-all decision/decision decisions ))
  )
(defn header []
  (dom/header #js {:id "header"}
    (dom/h1 nil "Big decisions")))

(defn big-decision-app [{:keys [decisions new-decision] :as state} owner]
  (reify om/IRender
    (render [_]
      (dom/div nil
        (header)
        (decision-list decisions new-decision owner)))))

(om/root
  big-decision-app
  app-state
  {:target (. js/document (getElementById "app"))})

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
  )

;; *#1 List your features:* We wrote down everything that we thought we would like as a feature in a house and property. We’d both lived in at least 5 places by now, and inspected scores more, so it was a pretty long list. We also wrote down things that we definitely didn’t want, but we wrote these as positive items — things we wanted — e.g. “Not next to a power substation.”

;; *#2 Sort your features:* We sorted the list of features, so that we had a list of most important features to least important. I actually wrote a small computer program that helped us do this by presenting features two at a time and making us choose which was more important. We asked ourselves: “If there were two identical houses except that one had this feature and the other house had the other feature, which would we choose?” We entered this into the program, and it sorted the list based on our answers.

;; *#3 Score your options:* For every house we visited, we scored the property for each feature out of 5 stars (no half stars allowed!). We kept the whole thing together in one spreadsheet. This gave us a commanding overview of the decision we were making.
