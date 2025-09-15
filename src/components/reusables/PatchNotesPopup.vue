<script setup>
import { ref } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const activeTab = ref('commits')
const commits = ref([])
const loadingCommits = ref(false)
const commitsError = ref('')
const readme = ref('')
const loadingReadme = ref(false)
const readmeError = ref('')

async function fetchCommits() {
  if (commits.value.length > 0) return // Already loaded
  
  loadingCommits.value = true
  commitsError.value = ''
  
  try {
    const response = await fetch('https://api.github.com/repos/Antoine-P02/aoc-display/commits?per_page=20')
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    const data = await response.json()
      //   .filter(commit => commit.commit.message.startsWith('Update'))
      commits.value = data.map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date),
        htmlUrl: commit.html_url
      }))
  } catch (error) {
    console.error('Failed to fetch commits:', error)
    commitsError.value = 'Failed to load commits from GitHub'
  } finally {
    loadingCommits.value = false
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`
}

function closePopup() {
  emit('close')
}

function switchToCommits() {
  activeTab.value = 'commits'
  fetchCommits()
}

async function fetchReadme() {
  if (readme.value.length > 0) return // Already loaded
  
  loadingReadme.value = true
  readmeError.value = ''
  
  try {
    const response = await fetch('https://api.github.com/repos/Antoine-P02/aoc-display/readme')
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    const data = await response.json()
    // Decode base64 content
    readme.value = atob(data.content)
  } catch (error) {
    console.error('Failed to fetch README:', error)
    readmeError.value = 'Failed to load README from GitHub'
  } finally {
    loadingReadme.value = false
  }
}

function switchToReadme() {
  activeTab.value = 'readme'
  fetchReadme()
}
</script>

<style scoped>
/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1e2939;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #364153;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #4a5565;
}
</style>


<template>
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="closePopup">
        <div class="bg-dark-gray rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray">
                <div class="flex items-center gap-3">
                    <i class="fas fa-code-branch text-2xl text-green" />
                    <div>
                        <h2 class="text-2xl font-bold text-white">Development Info</h2>
                        <p class="text-light-gray text-sm">Latest updates, commits, and upcoming features</p>
                    </div>
                </div>
                <button @click="closePopup" class="text-light-gray hover:text-white transition-colors p-2">
                    <i class="fas fa-times text-xl" />
                </button>
            </div>            <!-- Tabs -->
            <div class="flex border-b border-gray">
                <!-- <button @click="activeTab = 'patch-notes'" :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2',
                    activeTab === 'patch-notes'
                        ? 'text-white border-green bg-dark-green bg-opacity-20'
                        : 'text-light-gray border-transparent hover:text-white hover:border-gray']">
                    <i class="fas fa-clipboard-list mr-2" />
                    Patch Notes
                </button> -->
                <button @click="switchToCommits" :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2',
                    activeTab === 'commits'
                        ? 'text-white border-blue bg-blue bg-opacity-20'
                        : 'text-light-gray border-transparent hover:text-white hover:border-gray']">
                    <i class="fab fa-git-alt mr-2" />
                    Latest Commits
                </button>
                <button @click="switchToReadme" :class="['px-6 py-3 text-sm font-medium transition-colors border-b-2',
                    activeTab === 'readme'
                        ? 'text-white border-yellow bg-yellow bg-opacity-20'
                        : 'text-light-gray border-transparent hover:text-white hover:border-gray']">
                    <i class="fas fa-book mr-2" />
                    README
                </button>
            </div><!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Patch Notes Tab -->
                <div v-if="activeTab === 'patch-notes'">
                    <!-- Current Version -->
                    <div class="bg-gradient-to-r from-green to-dark-green rounded-lg p-4 border-l-4 border-light-green">
                        <div class="flex items-center gap-2 mb-2">
                            <span
                                class="bg-light-green text-dark-green px-2 py-1 rounded-full text-xs font-bold">CURRENT</span>
                            <h3 class="text-xl font-bold text-white">v3.2.1 - December 15, 2024</h3>
                        </div>
                        <ul class="space-y-2 text-white">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added real-time message synchronization</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Improved authentication system with token validation</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed message deletion and editing bugs</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Enhanced UI responsiveness on mobile devices</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.2.0 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-blue">
                        <h3 class="text-lg font-bold text-white mb-2">v3.2.0 - December 10, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added user profile customization</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented QR code generation for profiles</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added message editing functionality</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Improved chat message rendering performance</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed timezone issues in message timestamps</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.9 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-dark-blue">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.9 - December 5, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added sound notifications for new messages</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented message search functionality</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Enhanced scroll behavior in chat</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed image upload preview</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.8 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-medium-yellow">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.8 - November 30, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added Advent of Code integration</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented star progress tracking</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added completion feed view</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Improved date formatting across the app</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed leaderboard data fetching</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.7 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-red">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.7 - November 25, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added user authentication system</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented secure token-based login</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Enhanced database connection handling</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed memory leaks in message polling</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.6 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-light-green">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.6 - November 20, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added real-time chat functionality</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented message persistence</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added IP tracking for security</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Improved message formatting</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.5 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-light-blue">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.5 - November 15, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added MongoDB integration</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented message history</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Enhanced error handling</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed CORS issues</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.4 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-dark-yellow">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.4 - November 10, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added Vercel deployment support</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented serverless functions</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Optimized API endpoints</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed environment variable handling</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.3 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-darker-yellow">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.3 - November 5, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added Tailwind CSS v4 support</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented custom color scheme</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Enhanced responsive design</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed button hover states</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Version 3.1.2 -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-green">
                        <h3 class="text-lg font-bold text-white mb-2">v3.1.2 - October 30, 2024</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Added Vue Router integration</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-plus text-green mt-1" />
                                <span>Implemented page navigation</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Improved component structure</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-wrench text-yellow mt-1" />
                                <span>Fixed routing issues</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Coming Soon Section -->
                    <div class="bg-gradient-to-r from-dark-blue to-blue rounded-lg p-4 border-l-4 border-light-blue">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-light-blue text-dark-blue px-2 py-1 rounded-full text-xs font-bold">COMING
                                SOON</span>
                            <h3 class="text-xl font-bold text-white">v3.3.0 - Q1 2025</h3>
                        </div>
                        <ul class="space-y-2 text-white">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-star text-yellow mt-1" />
                                <span>Real-time multiplayer code collaboration</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-star text-yellow mt-1" />
                                <span>Advanced statistics and analytics</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-star text-yellow mt-1" />
                                <span>Custom themes and UI customization</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-star text-yellow mt-1" />
                                <span>Integration with GitHub and GitLab</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-star text-yellow mt-1" />
                                <span>Advanced notification system</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-star text-yellow mt-1" />
                                <span>Plugin system for extensions</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Future Plans -->
                    <div
                        class="bg-gradient-to-r from-medium-yellow to-dark-yellow rounded-lg p-4 border-l-4 border-yellow">
                        <div class="flex items-center gap-2 mb-2">
                            <span
                                class="bg-yellow text-dark-yellow px-2 py-1 rounded-full text-xs font-bold">ROADMAP</span>
                            <h3 class="text-xl font-bold text-white">Future Releases</h3>
                        </div>
                        <ul class="space-y-2 text-white">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Mobile app development (iOS/Android)</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>AI-powered code suggestions</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Team management and collaboration tools</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Advanced security features</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Integration with popular IDEs</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Cloud storage and backup</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>API for third-party integrations</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Advanced user permissions system</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Performance monitoring dashboard</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-rocket text-yellow mt-1" />
                                <span>Multi-language support</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Bug Fixes and Improvements -->
                    <div class="bg-gray rounded-lg p-4 border-l-4 border-red">
                        <h3 class="text-lg font-bold text-white mb-2">Recent Bug Fixes & Improvements</h3>
                        <ul class="space-y-1 text-light-gray">
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Fixed memory leak in chat auto-refresh</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Resolved authentication token expiry issues</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Fixed scroll position jumping in chat</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Corrected timezone calculations</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Fixed profile picture upload validation</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Resolved database connection timeout issues</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Fixed responsive layout on mobile devices</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Corrected message ordering in chat history</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Fixed QR code generation errors</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <i class="fas fa-bug text-red mt-1" />
                                <span>Resolved API rate limiting issues</span>
                            </li>
                        </ul>
                    </div> <!-- Developer Notes -->
                    <div class="bg-dark-gray rounded-lg p-4 border border-light-gray">
                        <h3 class="text-lg font-bold text-white mb-2">Developer Notes</h3>
                        <p class="text-light-gray text-sm leading-relaxed">
                            This application is continuously evolving based on user feedback and modern web development
                            practices.
                            We're committed to providing regular updates, maintaining high performance, and ensuring a
                            smooth user experience.
                            If you encounter any issues or have suggestions for improvements, please don't hesitate to
                            reach out to our development team.
                        </p>
                        <div class="mt-3 flex gap-2">
                            <span class="bg-green text-white px-2 py-1 rounded text-xs">Vue 3</span>
                            <span class="bg-blue text-white px-2 py-1 rounded text-xs">Vite</span>
                            <span class="bg-yellow text-black px-2 py-1 rounded text-xs">Tailwind CSS</span>
                            <span class="bg-medium-yellow text-white px-2 py-1 rounded text-xs">MongoDB</span>
                            <span class="bg-dark-blue text-white px-2 py-1 rounded text-xs">Vercel</span>
                        </div>
                    </div>
                </div>

                <!-- Latest Commits Tab -->
                <div v-if="activeTab === 'commits'">
                    <!-- Repository Info Header -->
                    <div
                        class="bg-gradient-to-r from-dark-blue to-blue rounded-lg p-4 border-l-4 border-light-blue mb-6">
                        <div class="flex items-center gap-3 mb-2">
                            <i class="fab fa-github text-2xl text-white" />
                            <div>
                                <h3 class="text-xl font-bold text-white">GitHub Repository</h3>
                                <a href="https://github.com/Antoine-P02/aoc-display" target="_blank"
                                    class="text-light-blue hover:text-white transition-colors text-sm">
                                    Antoine-P02/aoc-display
                                    <i class="fas fa-external-link-alt ml-1" />
                                </a>
                            </div>
                        </div>
                        <p class="text-white text-sm">Latest commits from the main branch</p>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loadingCommits" class="text-center py-8">
                        <i class="fas fa-spinner fa-spin text-2xl text-blue mb-2" />
                        <p class="text-light-gray">Loading commits...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="commitsError"
                        class="bg-red bg-opacity-20 border border-red rounded-lg p-4 text-center">
                        <i class="fas fa-exclamation-triangle text-red text-xl mb-2" />
                        <p class="text-red">{{ commitsError }}</p>
                        <button @click="fetchCommits"
                            class="mt-2 px-4 py-2 bg-red text-white rounded hover:bg-red-hover transition-colors">
                            <i class="fas fa-redo mr-2" />
                            Retry
                        </button>
                    </div>

                    <!-- Commits List -->
                    <div v-else class="space-y-3">
                        <div v-for="commit in commits" :key="commit.sha"
                            class="bg-gray rounded-lg p-4 border-l-4 border-blue hover:bg-gray-hover transition-colors">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="bg-blue text-white px-2 py-1 rounded text-xs font-mono">{{
                                            commit.sha }}</span>
                                        <span class="text-light-gray text-xs">{{ formatTimeAgo(commit.date) }}</span>
                                    </div>
                                    <p class="text-white font-medium mb-2 leading-relaxed">{{ commit.message }}</p>
                                    <div class="flex items-center gap-4 text-sm text-light-gray">
                                        <div class="flex items-center gap-1">
                                            <i class="fas fa-user text-xs" />
                                            <span>{{ commit.author }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <i class="fas fa-calendar text-xs" />
                                            <span>{{ formatDate(commit.date) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <a :href="commit.htmlUrl" target="_blank"
                                    class="text-light-gray hover:text-white transition-colors p-2">
                                    <i class="fab fa-github text-lg" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- View More on GitHub -->
                    <div class="mt-6 text-center">
                        <a href="https://github.com/Antoine-P02/aoc-display/commits" target="_blank"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-dark-blue text-white rounded-lg hover:bg-blue transition-colors">
                            <i class="fab fa-github" />
                            View All Commits on GitHub
                            <i class="fas fa-external-link-alt text-sm" />
                        </a>                    </div>
                </div>

                <!-- README Tab -->
                <div v-if="activeTab === 'readme'">
                    <!-- Repository Info Header -->
                    <div
                        class="bg-gradient-to-r from-medium-yellow to-dark-yellow rounded-lg p-4 border-l-4 border-yellow mb-6">
                        <div class="flex items-center gap-3 mb-2">
                            <i class="fas fa-book text-2xl text-white" />
                            <div>
                                <h3 class="text-xl font-bold text-white">Project README</h3>
                                <a href="https://github.com/Antoine-P02/aoc-display/blob/main/README.md" target="_blank"
                                    class="text-yellow hover:text-white transition-colors text-sm">
                                    View on GitHub
                                    <i class="fas fa-external-link-alt ml-1" />
                                </a>
                            </div>
                        </div>
                        <p class="text-white text-sm">Project documentation and setup instructions</p>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loadingReadme" class="text-center py-8">
                        <i class="fas fa-spinner fa-spin text-2xl text-yellow mb-2" />
                        <p class="text-light-gray">Loading README...</p>
                    </div>

                    <!-- Error State -->
                    <div v-else-if="readmeError"
                        class="bg-red bg-opacity-20 border border-red rounded-lg p-4 text-center">
                        <i class="fas fa-exclamation-triangle text-red text-xl mb-2" />
                        <p class="text-red">{{ readmeError }}</p>
                        <button @click="fetchReadme"
                            class="mt-2 px-4 py-2 bg-red text-white rounded hover:bg-red-hover transition-colors">
                            <i class="fas fa-redo mr-2" />
                            Retry
                        </button>
                    </div>

                    <!-- README Content -->
                    <div v-else class="bg-gray rounded-lg p-6 border border-light-gray">
                        <div class="text-light-gray whitespace-pre-wrap font-mono text-sm leading-relaxed" 
                             v-html="readme.replace(/\n/g, '<br>')">
                        </div>
                    </div>

                    <!-- View on GitHub -->
                    <div class="mt-6 text-center">
                        <a href="https://github.com/Antoine-P02/aoc-display" target="_blank"
                            class="inline-flex items-center gap-2 px-6 py-3 bg-medium-yellow text-white rounded-lg hover:bg-yellow transition-colors">
                            <i class="fab fa-github" />
                            View Full Repository
                            <i class="fas fa-external-link-alt text-sm" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
