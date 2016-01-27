(ns hello-world.app-state)

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {
                          :projects [{
                                      :id        (guid)
                                      :name      "First project"
                                      :decisions [
                                                  {:id    (guid)
                                                   :title "First decision"
                                                   :score 0
                                                   }
                                                  ]
                                      }
                                     {
                                      :id        (guid)
                                      :name      "Second project"
                                      :decisions [
                                                  {
                                                   :id    (guid)
                                                   :title "First decision"
                                                   :score 0
                                                   }
                                                  {
                                                   :id    (guid)
                                                   :title "Second decision"
                                                   :score 0
                                                   }
                                                  ]
                                      }]
                          })
  )


(defn modify-project-decisions [state project-id modification]
  (let [
        project-index (first (keep-indexed (fn [i project] (when ((comp-id {:id project-id}) project) i)) (:projects state)))
        project (get-in state [:projects project-index])]
    (om/transact! project :decisions modification))
  )

(defn destroy-decision [{:keys [projects] :as state} {:keys [project-id  decision]}]
  (modify-project-decisions state project-id #(vec (remove (comp-id decision) %)))
  )

(defn create-decision [{:keys [projects] :as state} {:keys [project-id title]}]
  (modify-project-decisions state project-id #(conj % {:title title :score 0 :id (guid)}))
  )

(defn modify-projects [state modification]
  (om/transact! state :projects modification))

(defn destroy-project [state {:keys [project-id]}]
  (modify-projects state #(vec (remove (comp-id {:id project-id}) %))))

(defn create-project [state {:keys [name]}]
  (modify-projects state #(conj % {:name name :id (guid) :projects []})))
