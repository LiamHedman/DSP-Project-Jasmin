import { User } from '../../common/src/classes';

describe('User class', () => {
  const validUserData = {
    role: "admin",
    name: "John Doe",
    mail: "john@example.com",
    phone_number: "+1234567",
    biography: "This is a test bio",
    address: "Storgatan, 12, Stockholm",
    date_of_birth: "1995-01-01",
    profile_picture_url: "http://example.com/image.jpg",
    password: "abc123",
  };

  const createValidUser = () => new User(
    validUserData.role,
    validUserData.name,
    validUserData.mail,
    validUserData.phone_number,
    validUserData.biography,
    validUserData.address,
    validUserData.date_of_birth,
    validUserData.profile_picture_url,
    validUserData.password
  );

  describe('Constructor', () => {
    it('should create a user with valid parameters', () => {
      const user = createValidUser();
      expect(user).toBeInstanceOf(User);
    });

    it.each([
      ["", "Name parameter is of wrong format."],
      ["A", "Name parameter is of wrong format."]
    ])('should throw error for invalid name: %s', (name, expectedMsg) => {
      expect(() => new User(
        validUserData.role,
        name,
        validUserData.mail,
        validUserData.phone_number,
        validUserData.biography,
        validUserData.address,
        validUserData.date_of_birth,
        validUserData.profile_picture_url,
        validUserData.password
      )).toThrow(expectedMsg);
    });

    it.each([
      ["bademail.com", "Email is of wrong format."],
      ["@bad.com", "Email is of wrong format."]
    ])('should throw error for invalid email: %s', (email, expectedMsg) => {
      expect(() => new User(
        validUserData.role,
        validUserData.name,
        email,
        validUserData.phone_number,
        validUserData.biography,
        validUserData.address,
        validUserData.date_of_birth,
        validUserData.profile_picture_url,
        validUserData.password
      )).toThrow(expectedMsg);
    });

    it.each([
      ["abc", "Phone number is of wrong format."],
      ["+1234567890", "Phone number is of wrong format."]
    ])('should throw error for invalid phone number: %s', (phone, expectedMsg) => {
      expect(() => new User(
        validUserData.role,
        validUserData.name,
        validUserData.mail,
        phone,
        validUserData.biography,
        validUserData.address,
        validUserData.date_of_birth,
        validUserData.profile_picture_url,
        validUserData.password
      )).toThrow(expectedMsg);
    });

    it('should throw for invalid address', () => {
      expect(() => new User(
        validUserData.role,
        validUserData.name,
        validUserData.mail,
        validUserData.phone_number,
        validUserData.biography,
        "invalidAddress",
        validUserData.date_of_birth,
        validUserData.profile_picture_url,
        validUserData.password
      )).toThrow("Address is of wrong format.");
    });

    it('should throw for too young user', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 17);
      const recentDob = recentDate.toISOString().split("T")[0];
      expect(() => new User(
        validUserData.role,
        validUserData.name,
        validUserData.mail,
        validUserData.phone_number,
        validUserData.biography,
        validUserData.address,
        recentDob,
        validUserData.profile_picture_url,
        validUserData.password
      )).toThrow("Date of birth is of wrong format, or means user is too young.");
    });

    it('should throw for bad password', () => {
      expect(() => new User(
        validUserData.role,
        validUserData.name,
        validUserData.mail,
        validUserData.phone_number,
        validUserData.biography,
        validUserData.address,
        validUserData.date_of_birth,
        validUserData.profile_picture_url,
        "123"
      )).toThrow("Password is of wrong format.");
    });
  });

  describe('Setters', () => {
    let user: User;
    beforeEach(() => user = createValidUser());

    it('should update name correctly', () => {
      user.setName("New Name");
      expect(user.getName()).toBe("New Name");
    });

    it('should throw error for bad name', () => {
      expect(() => user.setName("A")).toThrow("New name is too short or of wrong format.");
    });

    it('should update email', () => {
      user.setEmail("new@example.com");
      expect(user.getMail()).toBe("new@example.com");
    });

    it('should throw for bad email', () => {
      expect(() => user.setEmail("bad")).toThrow("New email of wrong format.");
    });

    it('should update phone number', () => {
      user.setPhoneNumber("1234567");
      expect(user.getPhoneNumber()).toBe("1234567");
    });

    it('should throw for bad phone number', () => {
      expect(() => user.setPhoneNumber("abc")).toThrow("New phone number is of wrong format.");
    });

    it('should update address', () => {
      user.setAddress("Nygatan, 5, Malmö");
      expect(user.getAddress()).toBe("Nygatan, 5, Malmö");
    });

    it('should throw for bad address', () => {
      expect(() => user.setAddress("wrong format")).toThrow("New address is of wrong format.");
    });

    it('should throw for invalid date of birth', () => {
      expect(() => user.setDateOfBirth("2022-01-01")).toThrow("New date of birth is of wrong format, or means user is too young.");
    });

    it('should throw for invalid password', () => {
      expect(() => user.setPassword("abc")).toThrow("New password is of wrong format");
    });
  });

  describe('Supply & Demand Post Management', () => {
    let user: User;
    beforeEach(() => user = createValidUser());

    it('should add supply post id', () => {
      user.addSupplyPostId("123");
      expect(user.getSupplyPostIds()).toContain("123");
    });

    it('should remove supply post id', () => {
      user.addSupplyPostId("abc");
      expect(user.getSupplyPostIds()).toContain("abc");
      user.removeSupplyPostId("abc");
      expect(user.getSupplyPostIds()).not.toContain("abc");
    });

    it('should throw if removing non-existing supply post', () => {
      user.addSupplyPostId("abc");
      expect(() => user.removeSupplyPostId("missing")).toThrow("Requested id is not included in user's supply posts.");
    });

    it('should throw if supply list is empty', () => {
      expect(() => user.removeSupplyPostId("anything")).toThrow("Can not remove post with id anything due to user not having any active supply posts.");
    });

    it('should clear all supply posts', () => {
      user.addSupplyPostId("abc");
      user.addSupplyPostId("def");
      expect(user.getSupplyPostIds()).toContain("abc");
      user.removeAllSupplyPosts();
      expect(user.getSupplyPostIds()).not.toContain("abc");
      expect(user.getSupplyPostIds()).not.toContain("def");
    });
  });

  describe('Profile picture removal', () => {
    it('should remove profile picture url', () => {
      const user = createValidUser();
      user.removeProfilePictureUrl();
      expect(user.getProfilePictureUrl()).toBe("");
    });
  });
});
