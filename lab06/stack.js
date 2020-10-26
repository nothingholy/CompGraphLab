class Stack {
  constructor() {
    this.first = null;
  }

  push(val) {
    let n = new Node(val);
    if (this.first == null) {
      this.first = n;
    } else {
      n.next = this.first;
      this.first = n;
    }
  }

  pop() {
    let value = this.first.value;
    this.first = this.first.next;
    return value;
  }

  empty() {
    if (this.first == null) {
      return true;
    }
    return false;
  }

  traverse() {
    let node = this.first;
    while (node != null) {
      print(node.value);
      node = node.next;
    }
  }

}

class Node {
  constructor(val) {
    this.value = val;
    this.next = null;
  }
}