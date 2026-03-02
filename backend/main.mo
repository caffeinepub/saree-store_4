import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Category = {
    #saree;
    #jewelry;
    #handbag;
  };

  type Product = {
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

  type PartialProduct = {
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

  public type UserProfile = {
    name : Text;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 1;

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
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

  public shared ({ caller }) func addProduct(product : PartialProduct) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can add products");
    };

    let newProduct : Product = { product with id = nextProductId };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
  };

  public query func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func updateProduct(id : Nat, updatedProduct : PartialProduct) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    let productWithId : Product = { updatedProduct with id };
    products.add(id, productWithId);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can delete products");
    };

    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };

    products.remove(id);
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
};
