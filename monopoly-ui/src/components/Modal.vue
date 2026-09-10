<template>
    <Modal
        v-model="isVisible"
        footer-hide
        :closable="false"
        :mask-closable="maskClosable"
        width="520">
        <template #header>
            <div style="display:flex;align-items:center;gap:12px;">
                <PlayerAvatar :playerIndex="playerIndex" />
                <span style="font-size:20px;font-weight:600;color:#2d8cf0;">{{ title }}</span>
            </div>
        </template>
        <div style="padding:4px 0;">
            <slot></slot>
        </div>
    </Modal>
</template>
<script>
import { Modal } from 'view-ui-plus';
import PlayerAvatar from '@/components/PlayerAvatar.vue';
export default {
    name: 'ModalComponent',
    components: { Modal, PlayerAvatar },
    props: {
        show: {
            type: Boolean,
            required: true
        },
        playerIndex: {
            type: Number,
            required: true
        },
        maskClosable: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isVisible: this.show
        };
    },
    mounted() {
        this.isVisible = this.show;
        console.log('Modal mounted with show:', this.show);
    },
    watch: {
        show(newVal) {
            this.isVisible = newVal;
            console.log('Modal show prop changed to:', newVal);
        }
    }
}
</script>