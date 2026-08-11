<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'CompositesPage',
  setup() {
    const cols = [
      { name: 'name', label: 'Name', field: 'name', sortable: true },
      { name: 'cal', label: 'Calories', field: 'cal', sortable: true }
    ]
    const rows = [
      { name: 'Frozen Yogurt', cal: 159 },
      { name: 'Ice cream', cal: 237 },
      { name: 'Eclair', cal: 262 },
      { name: 'Cupcake', cal: 305 },
      { name: 'Gingerbread', cal: 356 }
    ]
    return {
      cols,
      rows,
      pagination: ref({ rowsPerPage: 3 }),
      search: ref(''),
      slide: ref('style'),
      showDialog: ref(false),
      d2: ref(false)
    }
  }
}
</script>

<template>
  <q-page padding class="q-gutter-y-lg">
    <!-- 1. QBtn + QTooltip -->
    <section data-testid="composite-btn-tooltip">
      <div class="text-subtitle1 q-mb-sm">QBtn + QTooltip</div>
      <q-btn label="Hover" color="primary"
        ><q-tooltip>Tooltip</q-tooltip></q-btn
      >
    </section>
    <q-separator />

    <!-- 2. QBtn + QBadge -->
    <section data-testid="composite-btn-badge">
      <div class="text-subtitle1 q-mb-sm">QBtn + QBadge</div>
      <q-btn color="white" text-color="primary" icon="i-mdi-email">
        <q-badge color="red" floating>9</q-badge>
      </q-btn>
    </section>
    <q-separator />

    <!-- 3. QCard + QCardSection + QCardActions + QBtn -->
    <section data-testid="composite-card-actions">
      <div class="text-subtitle1 q-mb-sm">QCard + QCardActions + QBtn</div>
      <q-card style="max-width: 300px">
        <q-card-section>Content</q-card-section>
        <q-card-actions
          ><q-btn flat label="Action" color="primary"
        /></q-card-actions>
      </q-card>
    </section>
    <q-separator />

    <!-- 4. QCard + QItem + QAvatar -->
    <section data-testid="composite-card-item-avatar">
      <div class="text-subtitle1 q-mb-sm">QCard + QItem + QAvatar</div>
      <q-card style="max-width: 300px">
        <q-card-section
          ><q-item>
            <q-item-section avatar
              ><q-avatar color="primary" icon="i-mdi-person"
            /></q-item-section>
            <q-item-section><q-item-label>John</q-item-label></q-item-section>
          </q-item></q-card-section
        >
      </q-card>
    </section>
    <q-separator />

    <!-- 5. QToolbar + QBtn + QToolbarTitle -->
    <section data-testid="composite-toolbar-btns">
      <div class="text-subtitle1 q-mb-sm">QToolbar + QBtn</div>
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-btn flat round dense icon="i-mdi-menu" />
        <q-toolbar-title>Title</q-toolbar-title>
        <q-btn flat round dense icon="i-mdi-magnify" />
      </q-toolbar>
    </section>
    <q-separator />

    <!-- 6. QToolbar + QTabs -->
    <section data-testid="composite-toolbar-tabs">
      <div class="text-subtitle1 q-mb-sm">QToolbar + QTabs</div>
      <q-toolbar class="bg-primary text-white rounded-borders">
        <q-tabs shrink
          ><q-tab name="t1" label="Tab 1" /><q-tab name="t2" label="Tab 2"
        /></q-tabs>
      </q-toolbar>
    </section>
    <q-separator />

    <!-- 7. QItem + QAvatar + QItemLabel -->
    <section data-testid="composite-item-avatar">
      <div class="text-subtitle1 q-mb-sm">QItem + QAvatar</div>
      <q-list
        ><q-item>
          <q-item-section avatar
            ><q-avatar color="primary" icon="i-mdi-person"
          /></q-item-section>
          <q-item-section><q-item-label>John</q-item-label></q-item-section>
        </q-item></q-list
      >
    </section>
    <q-separator />

    <!-- 8. QItem + QBadge -->
    <section data-testid="composite-item-badge">
      <div class="text-subtitle1 q-mb-sm">QItem + QBadge</div>
      <q-list
        ><q-item>
          <q-item-section><q-item-label>Inbox</q-item-label></q-item-section>
          <q-item-section side
            ><q-badge color="red" rounded>9</q-badge></q-item-section
          >
        </q-item></q-list
      >
    </section>
    <q-separator />

    <!-- 9. QItem + QCheckbox -->
    <section data-testid="composite-item-checkbox">
      <div class="text-subtitle1 q-mb-sm">QItem + QCheckbox</div>
      <q-list
        ><q-item>
          <q-item-section avatar
            ><q-checkbox :model-value="true"
          /></q-item-section>
          <q-item-section><q-item-label>Task</q-item-label></q-item-section>
        </q-item></q-list
      >
    </section>
    <q-separator />

    <!-- 10. QItem + QRadio -->
    <section data-testid="composite-item-radio">
      <div class="text-subtitle1 q-mb-sm">QItem + QRadio</div>
      <q-list
        ><q-item>
          <q-item-section avatar
            ><q-radio :model-value="'a'" val="a"
          /></q-item-section>
          <q-item-section><q-item-label>Option</q-item-label></q-item-section>
        </q-item></q-list
      >
    </section>
    <q-separator />

    <!-- 11. QItem + QIcon + QToggle -->
    <section data-testid="composite-item-toggle">
      <div class="text-subtitle1 q-mb-sm">QItem + QIcon + QToggle</div>
      <q-list
        ><q-item>
          <q-item-section avatar
            ><q-icon name="notifications"
          /></q-item-section>
          <q-item-section><q-item-label>Notify</q-item-label></q-item-section>
          <q-item-section side
            ><q-toggle :model-value="true"
          /></q-item-section> </q-item
      ></q-list>
    </section>
    <q-separator />

    <!-- 12. QExpansionItem + QCard -->
    <section data-testid="composite-expansion-card">
      <div class="text-subtitle1 q-mb-sm">QExpansionItem + QCard</div>
      <q-expansion-item icon="i-mdi-compass" label="Details" default-opened>
        <q-card><q-card-section>Content</q-card-section></q-card>
      </q-expansion-item>
    </section>
    <q-separator />

    <!-- 13. QBtn + QDialog + QCard -->
    <section data-testid="composite-btn-dialog">
      <div class="text-subtitle1 q-mb-sm">QBtn + QDialog + QCard</div>
      <q-btn label="Open" color="primary" @click="showDialog = true" />
      <q-dialog v-model="showDialog">
        <q-card style="min-width: 250px">
          <q-card-section>Content</q-card-section>
          <q-card-actions
            ><q-btn flat label="Close" color="primary" v-close-popup
          /></q-card-actions>
        </q-card>
      </q-dialog>
    </section>
    <q-separator />

    <!-- 14. QHeader + QToolbar + QBtn + QPage -->
    <section data-testid="composite-header-toolbar">
      <div class="text-subtitle1 q-mb-sm">QHeader + QToolbar + QBtn</div>
      <q-layout
        container
        style="height: 100px"
        class="rounded-borders overflow-hidden"
      >
        <q-header class="bg-primary text-white">
          <q-toolbar
            ><q-btn flat round dense icon="i-mdi-menu" />
            <q-toolbar-title>App</q-toolbar-title>
            <q-btn flat round dense icon="i-mdi-magnify"
          /></q-toolbar>
        </q-header>
        <!-- QIcon + QBadge floating -->
        <q-separator />
        <!-- QIcon + QBadge floating -->
        <section data-testid="composite-header-toolbar-icon-badge">
          <div class="text-subtitle1 q-mb-sm">QIcon + QBadge</div>
          <div style="position: relative; display: inline-flex">
            <q-icon name="i-mdi-email-outline" size="32px" />
            <q-badge floating color="red" rounded label="5" />
          </div>
        </section>
        <q-separator />
        <q-page-container><q-page padding>Content</q-page></q-page-container>
      </q-layout>
    </section>
    <q-separator />

    <!-- 15. QHeader + QToolbar + QTabs -->
    <section data-testid="composite-header-tabs">
      <div class="text-subtitle1 q-mb-sm">QHeader + QToolbar + QTabs</div>
      <q-layout
        container
        style="height: 130px"
        class="rounded-borders overflow-hidden"
      >
        <q-header class="bg-primary text-white">
          <q-toolbar><q-toolbar-title>App</q-toolbar-title></q-toolbar>
          <q-tabs
            ><q-tab name="t1" label="Tab 1" /><q-tab name="t2" label="Tab 2"
          /></q-tabs>
        </q-header>
        <!-- QIcon + QBadge floating -->
        <q-separator />
        <!-- QIcon + QBadge floating -->
        <section data-testid="composite-header-tabs-icon-badge">
          <div class="text-subtitle1 q-mb-sm">QIcon + QBadge</div>
          <div style="position: relative; display: inline-flex">
            <q-icon name="i-mdi-email-outline" size="32px" />
            <q-badge floating color="red" rounded label="5" />
          </div>
        </section>
        <q-separator />
        <q-page-container><q-page padding>Content</q-page></q-page-container>
      </q-layout>
    </section>
    <q-separator />

    <!-- 16. QDrawer + QItem + QIcon + QScrollArea -->
    <section data-testid="composite-drawer-items">
      <div class="text-subtitle1 q-mb-sm">
        QDrawer + QItem + QIcon + QScrollArea
      </div>
      <q-layout
        container
        style="height: 150px"
        class="rounded-borders overflow-hidden"
      >
        <q-drawer :model-value="true" :width="140">
          <q-scroll-area style="height: 100%">
            <q-list>
              <q-item clickable
                ><q-item-section avatar><q-icon name="inbox" /></q-item-section
                ><q-item-section>Inbox</q-item-section></q-item
              >
              <q-item clickable
                ><q-item-section avatar><q-icon name="star" /></q-item-section
                ><q-item-section>Starred</q-item-section></q-item
              >
            </q-list>
          </q-scroll-area>
        </q-drawer>
        <!-- QIcon + QBadge floating -->
        <q-separator />
        <!-- QIcon + QBadge floating -->
        <section data-testid="composite-drawer-items-icon-badge">
          <div class="text-subtitle1 q-mb-sm">QIcon + QBadge</div>
          <div style="position: relative; display: inline-flex">
            <q-icon name="i-mdi-email-outline" size="32px" />
            <q-badge floating color="red" rounded label="5" />
          </div>
        </section>
        <q-separator />
        <q-page-container><q-page padding>Content</q-page></q-page-container>
      </q-layout>
    </section>
    <q-separator />

    <!-- 17. QFab + QFabAction -->
    <section data-testid="composite-fab-actions">
      <div class="text-subtitle1 q-mb-sm">QFab + QFabAction</div>
      <q-fab icon="i-mdi-plus" color="primary" direction="right">
        <q-fab-action color="secondary" icon="i-mdi-star" />
        <q-fab-action color="orange" icon="i-mdi-share-variant" />
      </q-fab>
    </section>
    <q-separator />

    <!-- 18. QForm + QInput + QBtn -->
    <section data-testid="composite-form-input-btn">
      <div class="text-subtitle1 q-mb-sm">QForm + QInput + QBtn</div>
      <q-form class="q-gutter-md" style="max-width: 350px">
        <q-input label="Name" :model-value="'John'" />
        <q-btn label="Submit" type="submit" color="primary" />
      </q-form>
    </section>
    <q-separator />

    <!-- 19. QInput + QIcon -->
    <section data-testid="composite-input-icon">
      <div class="text-subtitle1 q-mb-sm">QInput + QIcon</div>
      <q-input label="User" :model-value="'john'">
        <template v-slot:prepend><q-icon name="person" /></template>
      </q-input>
    </section>
    <q-separator />

    <!-- 20. QSelect + QChip -->
    <section data-testid="composite-select-chips">
      <div class="text-subtitle1 q-mb-sm">QSelect + QChip</div>
      <q-select
        :model-value="['A', 'B']"
        :options="['A', 'B', 'C']"
        label="Tags"
        use-chips
        multiple
        style="max-width: 350px"
      />
    </section>
    <q-separator />

    <!-- 21. QField + QIcon -->
    <section data-testid="composite-field-icon">
      <div class="text-subtitle1 q-mb-sm">QField + QIcon</div>
      <q-field label="User" stack-label>
        <template v-slot:prepend><q-icon name="person" /></template>
        <template v-slot:control
          ><div class="self-center full-width">johndoe</div></template
        >
      </q-field>
    </section>
    <q-separator />

    <!-- 22. QKnob + QIcon -->
    <section data-testid="composite-knob-icon">
      <div class="text-subtitle1 q-mb-sm">QKnob + QIcon</div>
      <q-knob :model-value="75" size="80px" show-value color="primary">
        <q-icon name="volume_up" class="q-knob-center" />
      </q-knob>
    </section>
    <q-separator />

    <!-- 23. QSlider + QBadge -->
    <section data-testid="composite-slider-badge">
      <div class="text-subtitle1 q-mb-sm">QSlider + QBadge</div>
      <q-slider :model-value="65" :min="0" :max="100" label color="primary" />
    </section>
    <q-separator />

    <!-- 24. QTabs + QTabPanels + QTabPanel -->
    <section data-testid="composite-tabs-panels">
      <div class="text-subtitle1 q-mb-sm">QTabs + QTabPanels</div>
      <q-tabs :model-value="'t1'"><q-tab name="t1" label="Tab 1" /></q-tabs>
      <q-tab-panels :model-value="'t1'">
        <q-tab-panel name="t1">Content 1</q-tab-panel>
      </q-tab-panels>
    </section>
    <q-separator />

    <!-- 25. QMenu + QList + QItem -->
    <section data-testid="composite-menu-list">
      <div class="text-subtitle1 q-mb-sm">QMenu + QList + QItem</div>
      <q-btn label="Menu" color="primary">
        <q-menu
          ><q-list>
            <q-item clickable v-close-popup
              ><q-item-section>Profile</q-item-section></q-item
            >
            <q-item clickable v-close-popup
              ><q-item-section>Settings</q-item-section></q-item
            >
          </q-list></q-menu
        >
      </q-btn>
    </section>
    <q-separator />

    <!-- 26. QInnerLoading + QCard -->
    <section data-testid="composite-inner-loading">
      <div class="text-subtitle1 q-mb-sm">QInnerLoading + QCard</div>
      <q-card style="position: relative; min-height: 80px">
        <q-card-section>Loading...</q-card-section>
        <q-inner-loading showing color="primary" />
      </q-card>
    </section>
    <q-separator />

    <!-- 27. QBanner + QBtn + QIcon -->
    <section data-testid="composite-banner-btn">
      <div class="text-subtitle1 q-mb-sm">QBanner + QBtn</div>
      <q-banner class="bg-primary text-white rounded-borders">
        <template v-slot:avatar><q-icon name="info" color="white" /></template>
        Notice
        <template v-slot:action
          ><q-btn flat color="white" label="Ok"
        /></template>
      </q-banner>
    </section>
    <q-separator />

    <!-- 28. QBar + QIcon + QSpace + QBtn -->
    <section data-testid="composite-bar-icons">
      <div class="text-subtitle1 q-mb-sm">QBar + QIcon + QBtn</div>
      <q-bar class="bg-grey-9 text-white rounded-borders">
        <q-icon name="laptop" />
        <div>Title</div>
        <q-space /> <q-btn dense flat icon="i-mdi-minus" /><q-btn
          dense
          flat
          icon="i-mdi-close"
        />
      </q-bar>
    </section>
    <q-separator />

    <!-- 29. QChatMessage + QAvatar -->
    <section data-testid="composite-chat-avatar">
      <div class="text-subtitle1 q-mb-sm">QChatMessage</div>
      <q-chat-message name="John" :model-value="'Hi'" sent />
      <q-chat-message name="Jane" :model-value="'Hello'" />
    </section>
    <q-separator />

    <!-- 30. QLinearProgress + QBadge -->
    <section data-testid="composite-progress-badge">
      <div class="text-subtitle1 q-mb-sm">QLinearProgress + QBadge</div>
      <q-linear-progress :value="0.65" color="primary" />
      <q-badge color="primary">65%</q-badge>
    </section>
    <q-separator />

    <!-- 31. QCheckbox + QItem -->
    <section data-testid="composite-checkbox-item">
      <div class="text-subtitle1 q-mb-sm">QCheckbox + QItem</div>
      <q-list
        ><q-item>
          <q-item-section avatar
            ><q-checkbox :model-value="true"
          /></q-item-section>
          <q-item-section><q-item-label>Remember</q-item-label></q-item-section>
        </q-item></q-list
      >
    </section>
    <q-separator />

    <!-- 32. QToolbar + QBreadcrumbs -->
    <section data-testid="composite-toolbar-breadcrumbs">
      <div class="text-subtitle1 q-mb-sm">QToolbar + QBreadcrumbs</div>
      <q-toolbar class="bg-grey-3 rounded-borders">
        <q-breadcrumbs
          ><q-breadcrumbs-el label="Home" /><q-breadcrumbs-el label="Products"
        /></q-breadcrumbs>
      </q-toolbar>
    </section>
    <q-separator />

    <!-- 33. QBtnDropdown + QList + QItem -->
    <section data-testid="composite-dropdown-list">
      <div class="text-subtitle1 q-mb-sm">QBtnDropdown + QList + QItem</div>
      <q-btn-dropdown label="Menu" color="primary">
        <q-list
          ><q-item clickable v-close-popup
            ><q-item-section>A</q-item-section></q-item
          ></q-list
        >
      </q-btn-dropdown>
    </section>
    <q-separator />

    <!-- 34. QTable + QPagination + QInput -->
    <section data-testid="composite-table-pagination">
      <div class="text-subtitle1 q-mb-sm">QTable + QPagination + QInput</div>
      <q-input v-model="search" label="Search" dense style="max-width: 300px" />
      <q-table
        :rows="rows"
        :columns="cols"
        :filter="search"
        hide-bottom
        :pagination="{ rowsPerPage: 3 }"
        style="max-width: 400px"
      />
      <q-pagination
        v-model="pagination.page"
        :max="2"
        :max-pages="3"
        direction-links
      />
    </section>
    <q-separator />

    <!-- 35. QCarousel with slides -->
    <section data-testid="composite-carousel">
      <div class="text-subtitle1 q-mb-sm">QCarousel</div>
      <q-carousel
        v-model="slide"
        style="max-width: 400px; height: 150px"
        animated
        arrows
      >
        <q-carousel-slide
          name="style"
          class="bg-primary text-white column flex-center"
        >
          <div class="text-h4">Slide 1</div>
        </q-carousel-slide>
        <q-carousel-slide
          name="tv"
          class="bg-secondary text-white column flex-center"
        >
          <div class="text-h4">Slide 2</div>
        </q-carousel-slide>
      </q-carousel>
    </section>
    <q-separator />

    <!-- 36. QFooter + QToolbar -->
    <section data-testid="composite-footer-toolbar">
      <div class="text-subtitle1 q-mb-sm">QFooter + QToolbar</div>
      <q-layout
        container
        style="height: 120px"
        class="rounded-borders overflow-hidden"
      >
        <!-- QIcon + QBadge floating -->
        <q-separator />
        <!-- QIcon + QBadge floating -->
        <section data-testid="composite-footer-toolbar-icon-badge">
          <div class="text-subtitle1 q-mb-sm">QIcon + QBadge</div>
          <div style="position: relative; display: inline-flex">
            <q-icon name="i-mdi-email-outline" size="32px" />
            <q-badge floating color="red" rounded label="5" />
          </div>
        </section>
        <q-separator />
        <q-page-container><q-page padding>Body</q-page></q-page-container>
        <q-footer class="bg-grey-8 text-white">
          <q-toolbar><q-toolbar-title>Footer</q-toolbar-title></q-toolbar>
        </q-footer>
      </q-layout>
    </section>
    <!-- QIcon + QBadge floating -->
    <q-separator />
    <!-- QIcon + QBadge floating -->
    <section data-testid="composite-icon-badge">
      <div class="text-subtitle1 q-mb-sm">QIcon + QBadge</div>
      <div style="position: relative; display: inline-flex">
        <q-icon name="i-mdi-email-outline" size="32px" />
        <q-badge floating color="red" rounded label="5" />
      </div>
    </section>
    <q-separator />
  </q-page>
</template>
