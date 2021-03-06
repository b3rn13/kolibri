import { AttemptLogResource, ExamAttemptLogResource } from 'kolibri.resources';

export function setLearners(store, { questionId, exerciseId, quizId, classId, groupId }) {
  let resource = AttemptLogResource;
  const getParams = {
    item: questionId,
    content: exerciseId,
  };
  if (quizId) {
    resource = ExamAttemptLogResource;
    getParams.examId = quizId;
  }
  if (classId) {
    getParams.classroom = classId;
  }
  if (groupId) {
    getParams.learner_group = groupId;
  }
  return resource
    .fetchCollection({
      getParams,
      force: true,
    })
    .then(attemptLogs => {
      attemptLogs = attemptLogs.filter(attemptLog => !attemptLog.correct);

      let learners;
      // Add learner information to each attemptLog to turn this into
      // a list of learners with attempt information intermixed.
      if (quizId) {
        // For quizzes, run through all learners in the appropriate collection
        // So that we can show 'not attempted' in the sidebar for additional
        // info.
        learners = Object.values(store.rootState.classSummary.examLearnerStatusMap[quizId]).map(
          learner => {
            const returnLearner = {};
            const attemptLog = attemptLogs.find(log => log.user === learner.learner_id);
            if (attemptLog) {
              Object.assign(returnLearner, attemptLog);
            } else {
              Object.assign(returnLearner, {
                item: questionId,
                noattempt: true,
              });
            }
            Object.assign(
              returnLearner,
              store.rootState.classSummary.learnerMap[learner.learner_id]
            );
            return returnLearner;
          }
        );
      } else {
        // For exercises, only run through the learners with attempts
        learners = attemptLogs.map(attemptLog => {
          const learner = store.rootState.classSummary.learnerMap[attemptLog.user];
          return {
            ...attemptLog,
            ...learner,
          };
        });
      }

      // Re-set the learner data.
      store.commit('SET_LEARNERS', learners);
      return store.getters.learners;
    });
}
