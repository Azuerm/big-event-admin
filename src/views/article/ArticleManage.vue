<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artGetListService, artDelService } from '@/api/article.js'
import { formatTime } from '@/utils/format.js'
import ArticleEdit from './components/ArticleEdit.vue'
const articleList = ref([]) // 文章列表
const total = ref(0) // 文章总数
const loading = ref(false) // loading状态
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 当前生效的每页条数
  cate_id: '',
  state: ''
})
// 基于params参数获得文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()
// 处理分页逻辑
const onSizeChange = (size) => {
  // console.log('当前每页条数', size)
  // 只要是每页条数变化了，那么原本正在访问的当前页意义不大了，数据大概率以及不在原来那一页了
  params.value.pagenum = 1
  params.value.size = size
  // 基于最新的当前页 和 每页条数，渲染页面
  getArticleList()
}
const onCurrentChange = (page) => {
  // console.log('页码变化了', page)
  // 更新当前页
  params.value.pagenum = page
  // 基于最新的当前页，渲染数据
  getArticleList()
}
// 搜索逻辑 => 按照最新的条件，重新检索，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1 // 重置页面
  getArticleList()
}
// 重置逻辑 => 将筛选条件清空，重新检索，从第一页开始展示
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}
const articleEditRef = ref()
// 添加逻辑
const onAddArticle = () => {
  // visibleDrawer.value = true
  articleEditRef.value.openDrawer({})
}
// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.openDrawer(row)
}
// 删除逻辑
const oneDeletetArticle = async (row) => {
  // console.log(row)
  await artDelService(row.id)
  getArticleList()
}
// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type == 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数，在渲染
    params.value.pagenum = lastPage
    getArticleList()
  } else {
    // 如果是编辑，直接渲染当前页面即可
    getArticleList()
  }
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章分类：" style="min-width: 200px">
        <!-- vue2 => v-model: :value 和 @input 的简写 -->
        <!-- vue3 => v-model: :modelValue 和 @update:modelValue 的简写 -->
        <!-- <ChannelSelect v-model="params.cate_id"></ChannelSelect> -->
        <ChannelSelect v-model:cid="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：" style="min-width: 200px">
        <!-- 这里后台标记发布状态，就是通过中文标记的，已发布 / 草稿 -->
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <!-- 利用作用域插槽 row 可以获取当前行的数据 => v-for 遍历 item -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="oneDeletetArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper ,total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <ArticleEdit
      @success="onSuccess"
      ref="articleEditRef"
      v-model:cid="params.cate_id"
    ></ArticleEdit>
  </page-container>
</template>

<script setup></script>
