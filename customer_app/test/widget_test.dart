import 'package:flutter_test/flutter_test.dart';
import 'package:vaago_customer_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const VaaGoCustomerApp());
    expect(find.byType(VaaGoCustomerApp), findsOneWidget);
  });
}
