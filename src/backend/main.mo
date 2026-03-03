import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Category = {
    #saree;
    #jewelry;
    #handbag;
  };

  public type Product = {
    id : Nat;
    name : Text;
    category : Category;
    price : Nat;
    description : Text;
    imageUrl : Text;
    isNewArrival : Bool;
    isOnOffer : Bool;
    offerDetails : ?Text;
    stockQuantity : Nat;
  };

  public type PartialProduct = {
    name : Text;
    category : Category;
    price : Nat;
    description : Text;
    imageUrl : Text;
    isNewArrival : Bool;
    isOnOffer : Bool;
    offerDetails : ?Text;
    stockQuantity : Nat;
  };

  var nextProductId = 0;
  let products = Map.empty<Nat, Product>();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public shared ({ caller }) func addProduct(product : PartialProduct) : async () {
    let newProduct : Product = {
      product with id = nextProductId;
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
  };

  public query func getProduct(id : Nat) : async Product {
    let product = products.get(id);
    switch (product) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : PartialProduct) : async () {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_) {
        let productWithId : Product = { updatedProduct with id };
        products.add(id, productWithId);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_) {
        products.remove(id);
      };
    };
  };

  public query func getProductsByCategory(category : Category) : async [Product] {
    products.values().toArray().filter(func(product) { product.category == category });
  };

  public query func getNewArrivals() : async [Product] {
    products.values().toArray().filter(func(product) { product.isNewArrival });
  };

  public query func getOnOfferProducts() : async [Product] {
    products.values().toArray().filter(func(product) { product.isOnOffer });
  };

  func containsIgnoringCase(text : Text, pattern : Text) : Bool {
    let lowerPattern = pattern.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else {
          c;
        };
      }
    );

    let lowerText = text.map(
      func(c) {
        if (c >= 'A' and c <= 'Z') {
          Char.fromNat32(c.toNat32() + 32);
        } else {
          c;
        };
      }
    );
    lowerText.contains(#text lowerPattern);
  };

  public query func searchProducts(searchTerm : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        containsIgnoringCase(product.name, searchTerm) or containsIgnoringCase(product.description, searchTerm);
      }
    );
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
