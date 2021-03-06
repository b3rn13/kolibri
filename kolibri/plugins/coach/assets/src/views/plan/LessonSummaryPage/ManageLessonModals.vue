<template>

  <div>
    <AssignmentChangeStatusModal
      v-if="lessonsModalSet === AssignmentActions.CHANGE_STATUS"
      :modalTitle="$tr('changeLessonStatusTitle')"
      :modalDescription="$tr('changeLessonStatusDescription')"
      :modalActiveOption="$tr('changeLessonStatusActive')"
      :modalInactiveOption="$tr('changeLessonStatusInactive')"
      :active="currentLesson.is_active"
      @changeStatus="handleChangeStatus"
      @cancel="setLessonsModal(null)"
    />

    <AssignmentDetailsModal
      v-else-if="lessonsModalSet === AssignmentActions.EDIT_DETAILS"
      ref="detailsModal"
      :modalTitle="$tr('editLessonDetails')"
      :submitErrorMessage="$tr('saveLessonError')"
      :modalTitleErrorMessage="lessonDetailEditorStrings.$tr('duplicateTitle')"
      :initialDescription="currentLesson.description"
      :showDescriptionField="true"
      :isInEditMode="true"
      :initialTitle="currentLesson.title"
      :initialSelectedCollectionIds="initialSelectedCollectionIds"
      :classId="classId"
      :groups="learnerGroups"
      @save="handleDetailsModalSave"
      @cancel="setLessonsModal(null)"
    />

    <AssignmentCopyModal
      v-else-if="lessonsModalSet === AssignmentActions.COPY"
      :modalTitle="$tr('copyLessonTitle')"
      :assignmentQuestion="$tr('assignmentQuestion')"
      :classId="classId"
      :classList="classList"
      @copy="handleCopy"
      @cancel="setLessonsModal(null)"
    />

    <AssignmentDeleteModal
      v-else-if="lessonsModalSet === AssignmentActions.DELETE"
      :modalTitle="$tr('deleteLessonTitle')"
      :modalDescription="$tr('deleteLessonConfirmation', { title: currentLesson.title })"
      :modalConfirmation="$tr('deleteLessonReassurance')"
      @delete="deleteLesson({ lessonId: currentLesson.id, classId })"
      @cancel="setLessonsModal(null)"
    />
  </div>

</template>


<script>

  import find from 'lodash/find';
  import { mapState, mapActions } from 'vuex';
  import { crossComponentTranslator } from 'kolibri.utils.i18n';
  import CatchErrors from 'kolibri.utils.CatchErrors';
  import { ERROR_CONSTANTS } from 'kolibri.coreVue.vuex.constants';
  import AssignmentChangeStatusModal from '../../plan/assignments/AssignmentChangeStatusModal';
  import AssignmentDetailsModal from '../../plan/assignments/AssignmentDetailsModal';
  import AssignmentCopyModal from '../../plan/assignments/AssignmentCopyModal';
  import AssignmentDeleteModal from '../../plan/assignments/AssignmentDeleteModal';
  import { AssignmentActions } from '../../../constants/assignmentsConstants';
  import LessonDetailEditor from '../../common/LessonDetailEditor';

  const lessonDetailEditorStrings = crossComponentTranslator(LessonDetailEditor);

  export default {
    name: 'ManageLessonModals',
    components: {
      AssignmentChangeStatusModal,
      AssignmentDetailsModal,
      AssignmentCopyModal,
      AssignmentDeleteModal,
    },
    computed: {
      ...mapState(['classList']),
      ...mapState('classSummary', { classId: 'id', className: 'name' }),
      ...mapState('lessonSummary', ['currentLesson', 'lessonsModalSet', 'learnerGroups']),
      AssignmentActions() {
        return AssignmentActions;
      },
      initialSelectedCollectionIds() {
        return this.currentLesson.lesson_assignments.map(recipient => recipient.collection);
      },
      lessonDetailEditorStrings() {
        return lessonDetailEditorStrings;
      },
    },
    methods: {
      ...mapActions('lessonSummary', [
        'setLessonsModal',
        'updateLessonStatus',
        'deleteLesson',
        'copyLesson',
        'updateLesson',
      ]),
      handleChangeStatus(isActive) {
        this.updateLessonStatus({ lessonId: this.currentLesson.id, isActive });
      },
      handleCopy(selectedClassroomId, selectedCollectionIds) {
        const payload = {
          title: this.$tr('copyOfLesson', { lessonTitle: this.currentLesson.title }).substring(
            0,
            50
          ),
          description: this.currentLesson.description,
          resources: this.currentLesson.resources,
          collection: selectedClassroomId,
          lesson_assignments: selectedCollectionIds.map(id => ({ collection: id })),
        };
        const classroomName = find(this.classList, { id: selectedClassroomId }).name;
        this.copyLesson({ payload, classroomName });
      },
      handleDetailsModalSave(payload) {
        this.updateLesson({
          lessonId: this.currentLesson.id,
          payload: {
            ...payload,
            lesson_assignments: payload.assignments,
          },
        })
          .then()
          .catch(error => {
            const errors = CatchErrors(error, [ERROR_CONSTANTS.UNIQUE]);
            if (errors) {
              this.$refs.detailsModal.handleSubmitTitleFailure();
            } else {
              this.$refs.detailsModal.handleSubmitFailure();
            }
          });
      },
    },
    $trs: {
      changeLessonStatusTitle: 'Change lesson status',
      changeLessonStatusDescription: 'Learners can only see active lessons',
      copyLessonTitle: 'Copy lesson to',
      changeLessonStatusActive: 'Active',
      changeLessonStatusInactive: 'Inactive',
      assignmentQuestion: 'Assign lesson to',
      deleteLessonTitle: 'Delete lesson',
      deleteLessonConfirmation: "Are you sure you want to delete '{ title }'?",
      deleteLessonReassurance: 'You can still view progress on these resources from Channels',
      editLessonDetails: 'Edit lesson details',
      newLesson: 'Create new lesson',
      saveLessonError: 'There was a problem saving this lesson',
      copyOfLesson: 'Copy of { lessonTitle }',
    },
  };

</script>


<style lang="scss" scoped></style>
