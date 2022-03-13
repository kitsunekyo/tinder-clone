import { useEffect, useState } from "react";
import { Nav } from "../components/Nav";
import { CONFIG } from "../config";
import { useAuth } from "../AuthProvider";

export const Onboarding = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    url: "",
    about: "",
  });

  useEffect(() => {
    setFormData({
      first_name: user?.first_name || "",
      dob_day: user?.dob_day || "",
      dob_month: user?.dob_month || "",
      dob_year: user?.dob_year || "",
      show_gender: user?.show_gender !== undefined ? user?.show_gender : false,
      gender_identity: user?.gender_identity || "man",
      gender_interest: user?.gender_interest || "woman",
      url: user?.url || "",
      about: user?.about || "",
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${CONFIG.apiUrl}/me`, {
      method: "put",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.status === 204) {
      setUser({ ...user, ...formData });
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} />

      <div className="p-6">
        <h2 className="title">Update Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-6">
            <section className="flex-1">
              <label className="block mb-4" htmlFor="first_name">
                First Name
              </label>
              <input
                className="input mb-6"
                type="text"
                id="first_name"
                name="first_name"
                required={true}
                value={formData.first_name}
                onChange={handleChange}
              />

              <label className="block mb-4">Birthday</label>

              <div className="flex items-center mb-6 gap-2">
                <input
                  className="input w-28"
                  type="number"
                  id="dob_day"
                  name="dob_day"
                  min={0}
                  max={31}
                  placeholder="DD"
                  required={true}
                  value={formData.dob_day}
                  onChange={handleChange}
                />
                <input
                  className="input w-28"
                  type="number"
                  id="dob_month"
                  name="dob_month"
                  min={0}
                  max={12}
                  placeholder="MM"
                  required={true}
                  value={formData.dob_month}
                  onChange={handleChange}
                />
                <input
                  className="input w-36"
                  type="number"
                  id="dob_year"
                  name="dob_year"
                  min={1900}
                  max={9999}
                  placeholder="YYYY"
                  required={true}
                  value={formData.dob_year}
                  onChange={handleChange}
                />
              </div>

              <label className="block mb-4">Gender</label>
              <div className="flex items-center mb-6 gap-2">
                <input
                  type="radio"
                  className="custom-radio"
                  id="gender_identity-man"
                  name="gender_identity"
                  required={true}
                  value="man"
                  onChange={handleChange}
                  checked={formData.gender_identity === "man"}
                />
                <label htmlFor="gender_identity-man">Man</label>

                <input
                  type="radio"
                  className="custom-radio"
                  id="gender_identity-woman"
                  name="gender_identity"
                  required={true}
                  value="woman"
                  onChange={handleChange}
                  checked={formData.gender_identity === "woman"}
                />
                <label htmlFor="gender_identity-woman">Woman</label>

                <input
                  type="radio"
                  className="custom-radio"
                  id="gender_identity-other"
                  name="gender_identity"
                  required={true}
                  value="other"
                  onChange={handleChange}
                  checked={formData.gender_identity === "other"}
                />
                <label htmlFor="gender_identity-other">other</label>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  name="show_gender"
                  id="show_gender"
                  onChange={handleChange}
                  checked={formData.show_gender}
                />
                <label htmlFor="show_gender">Show gender on my profile</label>
              </div>

              <label className="block mb-4">Show me</label>
              <div className="flex items-center mb-6 gap-2">
                <input
                  type="radio"
                  className="custom-radio"
                  id="gender_interest-man"
                  name="gender_interest"
                  required={true}
                  value="man"
                  onChange={handleChange}
                  checked={formData.gender_interest === "man"}
                />
                <label htmlFor="gender_interest-man">Man</label>
                <input
                  type="radio"
                  className="custom-radio"
                  id="gender_interest-woman"
                  name="gender_interest"
                  required={true}
                  value="woman"
                  onChange={handleChange}
                  checked={formData.gender_interest === "woman"}
                />
                <label htmlFor="gender_interest-woman">Woman</label>
                <input
                  type="radio"
                  className="custom-radio"
                  id="gender_interest-everyone"
                  name="gender_interest"
                  required={true}
                  value="everyone"
                  onChange={handleChange}
                  checked={formData.gender_interest === "everyone"}
                />
                <label htmlFor="gender_interest-everyone">everyone</label>
              </div>

              <label className="block mb-4" htmlFor="about">
                About me
              </label>
              <input
                className="input mb-6"
                type="text"
                id="about"
                name="about"
                placeholder="tell others something about you..."
                value={formData.about}
                onChange={handleChange}
              />

              <input
                type="submit"
                value="Submit"
                className="btn--tertiary block w-full"
              />
            </section>

            <section className="flex-1">
              <label htmlFor="about" className="block mb-4">
                Profile Picture
              </label>
              <input
                type="url"
                name="url"
                id="url"
                className="input"
                value={formData.url}
                onChange={handleChange}
              />
              {formData.url !== "" ? (
                <div className="pt-6">
                  <img
                    src={formData.url}
                    alt=""
                    className="rounded-md h-48 w-48 object-cover object-center"
                  />
                </div>
              ) : (
                <p>set your profile picture</p>
              )}
            </section>
          </div>
        </form>
      </div>
    </>
  );
};
