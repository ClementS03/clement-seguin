"use client"
import { useEffect } from "react"

export function ScrollRevealInit() {
  useEffect(() => {
    const init = () => {
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("revealed") }),
        { rootMargin: "-20px" }
      )
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    }
    if ("requestIdleCallback" in window) {
      requestIdleCallback(init, { timeout: 200 })
    } else {
      setTimeout(init, 0)
    }
  }, [])
  return null
}
