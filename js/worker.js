let allMembers = [];
let allEnums = [];

self.onmessage = function (e) {
  const { type, data, query } = e.data;

  if (type === "init") {
    initializeData(data);
    self.postMessage({ type: "init_complete" });
  } else if (type === "filter") {
    try {
      const results = filterItems(query);
      self.postMessage({ type: "filter_complete", results });
    } catch (error) {
      self.postMessage({ type: "filter_error", error: error.message });
    }
  }
};

function initializeData(data) {
  allMembers = [];
  allEnums = [];

  console.log("Worker: Initializing data", data);
  console.log("Worker: Classes count:", data?.classes?.length);
  console.log("Worker: Enums count:", data?.enums?.length);

  if (data.classes) {
    data.classes.forEach((cls) => {
      cls.members.forEach((member) => {
        allMembers.push({
          type: "member",
          name: member.name,
          memberType: member.member_type,
          valueType: member.value_type,
          className: cls.name,
          inheritance: cls.inherits || [],
          unreplicated: member.unreplicated,
          deprecated: member.deprecated,
          hidden: member.hidden,
          unscriptable: member.unscriptable,
          security: member.security,
        });
      });
    });
  }

  if (data.enums) {
    data.enums.forEach((enm) => {
      allEnums.push({
        type: "enum",
        name: enm.name,
        memberType: "Enum",
        valueType: null,
        className: "Enum",
        inheritance: [],
        unreplicated: false,
        deprecated: false,
        hidden: false,
        unscriptable: false,
        security: null,
        enumItems: enm.items,
      });
    });
  }
}

function evaluateQuery(item, query) {
  if (!query || query.trim() === "") {
    return true;
  }

  const {
    name,
    memberType: type,
    valueType,
    className,
    inheritance,
    unreplicated,
    deprecated,
    hidden,
    unscriptable,
    security,
  } = item;

  const result = eval(query);
  return !!result;
}

function filterMembers(query) {
  return allMembers.filter((member) => evaluateQuery(member, query));
}

function filterEnums(query) {
  if (!query || query.trim() === "") {
    return allEnums;
  }

  return allEnums.filter((enumObj) => {
    // Check if the enum itself matches (e.g., name == 'AccessoryType')
    if (evaluateQuery(enumObj, query)) {
      return true;
    }

    // Check if any individual enum item matches
    return enumObj.enumItems.some((item) => {
      const itemToEvaluate = {
        name: item.name,
        memberType: "Enum",
        type: "Enum",
        valueType: item.value,
        className: enumObj.name,
        inheritance: [],
        unreplicated: item.unreplicated,
        deprecated: item.deprecated,
        hidden: item.hidden,
        unscriptable: item.unscriptable,
        security: item.security,
      };
      return evaluateQuery(itemToEvaluate, query);
    });
  });
}

function filterItems(query) {
  const members = filterMembers(query);
  const enums = filterEnums(query);
  return [...members, ...enums];
}
