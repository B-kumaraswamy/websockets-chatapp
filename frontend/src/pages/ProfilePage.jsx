import { Camera, Loader2, Mail, User } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [optimisticImg, setOptimisticImg] = useOptimistic(
    authUser?.profilePic,
    (_prev, newImg) => newImg,
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;

      // 👇 Use startTransition for optimistic UI and async API together
      startTransition(async () => {
        setOptimisticImg(base64Image); // optimistic UI update

        try {
          await updateProfile({ profilePic: base64Image });
        } catch (error) {
          console.error("Upload failed", error);
        }
      });
    };
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="rounded-xl p-6 space-y-8 bg-base-200 shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-base-content">
              Profile
            </h1>
            <p className="mt-2 text-base-content/60">
              Your profile information
            </p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  isPending
                    ? optimisticImg
                    : authUser?.profilePic || "/vite.svg"
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-content/10"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isPending ? "opacity-60 pointer-events-none" : ""}
                `}
              >
                <span className="relative flex items-center justify-center">
                  {isPending ? (
                    <Loader2 className="w-5 h-5 text-base-200 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-base-200" />
                  )}
                </span>
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-base-content/60">
              {isPending
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User details */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-base-content/60 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 rounded-lg border border-base-content/10 text-base-content">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-base-content/60 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 rounded-lg border border-base-content/10 text-base-content">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account info */}
          <div className="mt-6 rounded-xl p-6 border border-base-content/10">
            <h2 className="text-lg font-medium text-base-content mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/80">Member Since</span>
                <span className="text-base-content">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-base-content/80">Account Status</span>
                <span className="text-success">Active</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/80">Last Login</span>
                <span className="text-base-content">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(authUser.lastlogin))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

/*
Here’s a simple, interview-friendly summary of the code, broken down into:

---

### ✅ **One-Line Summary**

> “I used React 19's `useTransition` and `useOptimistic` to instantly update the user’s profile picture UI while uploading, without waiting for the API response — improving UX with smooth, responsive feedback.”

---

### ✅ **Beginner-Friendly Explanation**

Imagine the user uploads a new photo. Normally:

* The image updates **only after** the server confirms it's saved.
* This creates a delay — which feels slow and unresponsive.

Instead, this code:

1. **Immediately shows the new image** using `useOptimistic` — as if the upload already succeeded.
2. Runs the real `updateProfile()` API in the background using `useTransition`.
3. While waiting:

   * A **spinner** is shown.
   * The image stays on screen without flickering.
4. If the API fails, we can easily show an error and fallback.

---

### ✅ **Why is it better than the usual approach?**

| Traditional Approach        | This Optimistic Approach         |
| --------------------------- | -------------------------------- |
| Waits for API to finish     | Shows the change **immediately** |
| Feels slow to the user      | Feels **instant and modern**     |
| Manual loading state needed | React handles with `isPending`   |
| UI reverts if not synced    | `useOptimistic` keeps it smooth  |

---

### ✅ **Why use `useTransition`?**

* Marks the update as **non-urgent** → React prioritizes keeping the app responsive.
* Gives us `isPending` state automatically → no need to manually manage spinners.

### ✅ **Why use `useOptimistic`?**

* Updates UI **before** the backend responds.
* Works great for things like:

  * Profile updates
  * Liking a post
  * Adding a comment
  * Reordering lists

---

### ✅ Interview Punchline

> "I used `useTransition` to schedule the async update and `useOptimistic` to instantly reflect the change in UI. This greatly improves perceived performance and creates a smoother user experience — especially important in high-interaction components like profile updates or social apps."

---

Let me know if you want a 30-second version or resume bullet for this!

===================

Great question! Testing the fallback of `useOptimistic` means simulating a **failed update** — so you can see how the UI behaves **when the backend API fails** after an optimistic update.

---

### ✅ To Test Fallback Behavior:

#### 🔧 **Step 1: Force the API to fail**

In your `updateProfile` function (likely inside your Zustand store), temporarily make it throw an error:

```js
// Inside updateProfile
throw new Error("Simulated failure");
```

Or, if using Axios:

```js
await axiosInstance.post("/update-profile", data);
throw new Error("Force failure after request");
```

---

#### 🔧 **Step 2: Add proper fallback logic**

Update your `handleImageUpload` like this:

```js
reader.onload = async () => {
  const base64Image = reader.result;

  // Show UI update immediately
  startTransition(() => {
    setOptimisticImg(base64Image); // optimistic update
  });

  try {
    await updateProfile({ profilePic: base64Image }); // fails here
  } catch (error) {
    // ⬅️ fallback logic
    toast.error("Upload failed");

    // ⬇️ Revert UI (rollback)
    startTransition(() => {
      setOptimisticImg(authUser?.profilePic); // reset to old one
    });
  }
};
```

---

### 🔍 Now test it:

1. Upload a new image.
2. You’ll see:

   * The image updates **immediately** (optimistic).
   * Then after \~1 second, it **reverts back** to old image.
   * And a toast says: “Upload failed”.

---

### ✅ Optional — Add spinner fallback too:

To make it obvious:

```jsx
{isPending ? (
  <Loader2 className="w-5 h-5 animate-spin" />
) : (
  <Camera className="w-5 h-5" />
)}
```

---

### ✅ Summary (for learning/testing):

| What you simulate    | What you expect to happen                   |
| -------------------- | ------------------------------------------- |
| API success          | Image stays updated immediately             |
| API failure (forced) | Image updates → reverts → shows error toast |

Let me know if you want a `jest`/`vitest` style unit test too!


*/
