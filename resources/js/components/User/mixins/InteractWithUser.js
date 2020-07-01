export default {
    methods: {
        async getUser() {
            if (this.$root.user === null) {
                if (localStorage.token) {
                    if (!localStorage.user) {
                        await this.refreshUser()
                    }
                    this.$root.user = JSON.parse(localStorage.user)
                }
            }
            return this.$root.user
        },

        async refreshUser(redirect = true) {
            try {
                let response = await magento.get('customers/me', {
                    headers: { Authorization: `Bearer ${localStorage.token}` }
                })
                localStorage.user = JSON.stringify(response.data)
                this.$root.user = response.data
            } catch (error) {
                if (error.response.status == 401) {
                    localStorage.removeItem('token')
                }
                if (redirect) {
                    Turbolinks.visit('/login')
                }
            }
        },

        logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.$root.user = null
            Turbolinks.visit('/')
        }
    },

    asyncComputed: {
        user: function () {
            return this.getUser()
        }
    }
}