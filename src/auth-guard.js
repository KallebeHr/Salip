// src/auth-guard.js
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

let userResolved = false
let currentUser = null

const waitForAuth = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    currentUser = user
    userResolved = true
    resolve(user)
  })
})

export async function isUserAuthenticated() {
  if (!userResolved) {
    await waitForAuth
  }
  return !!currentUser
}
