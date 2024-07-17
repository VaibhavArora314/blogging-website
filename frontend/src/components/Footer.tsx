import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-muted text-muted-foreground py-6">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6">
      <p className="text-sm">© 2024 Blogify. All rights reserved.</p>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
          Privacy Policy
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" to="/">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
  )
}

export default Footer
