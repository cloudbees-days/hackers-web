<template>
  <section>
    <div class="container">
      <div class="box" id="content">
        <h1 class="title">Hot posts</h1>
        <hr class="hr">
        <ListItem v-for="post in posts"
                  :key="post.id"
                  :title="post.title"
                  :link="post.url"
                  :score="post.score"
                  :user="post.by"
                  :comment_link="post.comments_url"
                  :comment_count="post.descendants"
        />
      </div>
    </div>
  </section>
</template>
<script>
import axios from 'axios'
import ListItem from '../components/ListItem'
import { getConfig } from '../config'

export default {
  components: { ListItem },
  data () {
    return {
      posts: []
    }
  },
  async created () {
    try {
      const { apiUrl } = getConfig()
      let response = await axios.get(`${apiUrl}/stories/top`)
      this.posts = response.data.map(story => ({
        id: story.id,
        title: story.title,
        url: story.url,
        score: story.points,
        by: story.submitted_by,
        descendants: story.comments,
        comments_url: story.comments_url
      }))
    } catch (err) {
      console.log('Error fetching stories:', err)
    }
  }
}
</script>
<style lang="stylus">
  #content {
    margin-left: 10px
    margin-right: 10px
  }
</style>
