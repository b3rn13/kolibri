<template>

  <CoreBase
    :immersivePage="false"
    :authorized="userIsAuthorized"
    authorizedRole="adminOrCoach"
    :showSubNav="true"
  >

    <TopNavbar slot="sub-nav" />

    <KPageContainer>
      <ReportsHeader />
      <!-- TODO COACH
      <KCheckbox :label="coachStrings.$tr('viewByGroupsLabel')" />
      <h2>{{ coachStrings.$tr('overallLabel') }}</h2>
       -->
      <CoreTable :emptyMessage="coachStrings.$tr('learnerListEmptyState')">
        <thead slot="thead">
          <tr>
            <th>{{ coachStrings.$tr('nameLabel') }}</th>
            <th>{{ coachStrings.$tr('groupsLabel') }}</th>
            <th>{{ coachStrings.$tr('avgQuizScoreLabel') }}</th>
            <th>{{ coachStrings.$tr('exercisesCompletedLabel') }}</th>
            <th>{{ coachStrings.$tr('resourcesViewedLabel') }}</th>
            <th>{{ coachStrings.$tr('lastActivityLabel') }}</th>
          </tr>
        </thead>
        <transition-group slot="tbody" tag="tbody" name="list">
          <tr v-for="tableRow in table" :key="tableRow.id">
            <td>
              <KLabeledIcon>
                <KIcon slot="icon" person />
                <KRouterLink
                  :text="tableRow.name"
                  :to="classRoute('ReportsLearnerReportPage', { learnerId: tableRow.id })"
                />
              </KLabeledIcon>
            </td>
            <td><TruncatedItemList :items="tableRow.groups" /></td>
            <td><Score :value="tableRow.avgScore" /></td>
            <td>{{ coachStrings.$tr('integer', {value: tableRow.exercises}) }}</td>
            <td>{{ coachStrings.$tr('integer', {value: tableRow.resources}) }}</td>
            <td><ElapsedTime :date="tableRow.lastActivity" /></td>
          </tr>
        </transition-group>
      </CoreTable>
    </KPageContainer>
  </CoreBase>

</template>


<script>

  import ElapsedTime from 'kolibri.coreVue.components.ElapsedTime';
  import commonCoach from '../common';
  import ReportsHeader from './ReportsHeader';

  export default {
    name: 'ReportsLearnerListPage',
    components: {
      ReportsHeader,
      ElapsedTime,
    },
    mixins: [commonCoach],
    computed: {
      table() {
        const sorted = this._.sortBy(this.learners, ['name']);
        const mapped = sorted.map(learner => {
          const groupNames = this.getGroupNames(
            this._.map(this.groups.filter(group => group.member_ids.includes(learner.id)), 'id')
          );
          const examStatuses = this.examStatuses.filter(status => learner.id === status.learner_id);
          const contentStatuses = this.contentStatuses.filter(
            status => learner.id === status.learner_id
          );
          const augmentedObj = {
            groups: groupNames,
            avgScore: this.avgScore(examStatuses),
            lessons: undefined,
            exercises: this.exercisesCompleted(contentStatuses),
            resources: this.resourcesViewed(contentStatuses),
            lastActivity: this.lastActivity(examStatuses, contentStatuses),
          };
          Object.assign(augmentedObj, learner);
          return augmentedObj;
        });
        return mapped;
      },
    },
    methods: {
      avgScore(examStatuses) {
        const statuses = examStatuses.filter(status => status.status === this.STATUSES.completed);
        if (!statuses.length) {
          return null;
        }
        return this._.meanBy(statuses, 'score');
      },
      lastActivity(examStatuses, contentStatuses) {
        const statuses = [...examStatuses, ...contentStatuses];
        if (!statuses.length) {
          return null;
        }
        return this._.maxBy(statuses, 'last_activity').last_activity;
      },
      exercisesCompleted(contentStatuses) {
        const statuses = contentStatuses.filter(
          status =>
            this.contentMap[status.content_id].kind === 'exercise' &&
            status.status === this.STATUSES.completed
        );
        return statuses.length;
      },
      resourcesViewed(contentStatuses) {
        const statuses = contentStatuses.filter(
          status =>
            this.contentMap[status.content_id].kind !== 'exercise' &&
            status.status !== this.STATUSES.notStarted
        );
        return statuses.length;
      },
    },
  };

</script>


<style lang="scss" scoped></style>
