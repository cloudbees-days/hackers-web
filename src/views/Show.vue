<template>
  <section>
    <div class="container">
      <div class="box" id="content">
        <h1 class="title">Show HN</h1>
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
<style lang="stylus">
#content {
  margin-left: 10px
  margin-right: 10px
}
</style>
<script>
import axios from 'axios'
import ListItem from '../components/ListItem'

export default {
  components: { ListItem },
  data () {
    return {
      posts: []
    }
  },
  async created () {
    try {
      const apiUrl = process.env.VUE_APP_HN_API_URL || 'https://hn-api.preview.cb-demos.io/api'
      let response = await axios.get(`${apiUrl}/stories/show`)
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
